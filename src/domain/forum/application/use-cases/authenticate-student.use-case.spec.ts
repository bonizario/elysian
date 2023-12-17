import { FakeEncrypter } from '@/test/cryptography/fake-encrypter';
import { FakeHasher } from '@/test/cryptography/fake-hasher';
import { makeStudent } from '@/test/factories/make-student';
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students.repository';
import { AuthenticateStudentUseCase } from './authenticate-student.use-case';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeEncrypter: FakeEncrypter;
let fakeHasher: FakeHasher;
let sut: AuthenticateStudentUseCase;

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    fakeHasher = new FakeHasher();

    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeEncrypter,
      fakeHasher,
      fakeHasher,
    );
  });

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    await inMemoryStudentsRepository.create(student);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('should not be able to authenticate student with invalid credentials', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    await inMemoryStudentsRepository.create(student);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123123',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });
});
