import { FakeHasher } from '@/test/cryptography/fake-hasher';
import { makeStudent } from '@/test/factories/make-student';
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students.repository';
import { StudentAlreadyExistsError } from './errors/student-already-exists-error';
import { RegisterStudentUseCase } from './register-student.use-case';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    fakeHasher = new FakeHasher();

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
  });

  it('should be able to register a student', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    const student = inMemoryStudentsRepository.items[0];

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student,
    });
  });

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    const student = inMemoryStudentsRepository.items[0];

    expect(result.isRight()).toBe(true);
    expect(student.password).toEqual(hashedPassword);
  });

  it('should not be able to register a student with an email already in use', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
    });

    await inMemoryStudentsRepository.create(student);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError);
  });
});
