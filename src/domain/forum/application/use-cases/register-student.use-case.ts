import { Injectable } from '@nestjs/common';

import { left, right, type Either } from '@/core/either';

import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { StudentsRepository } from '@/domain/forum/application/repositories/students.repository';
import { Student } from '@/domain/forum/enterprise/entities/student';

import { StudentAlreadyExistsError } from './errors/student-already-exists-error';

type RegisterStudentUseCaseRequest = {
  email: string;
  name: string;
  password: string;
};

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail =
      await this.studentsRepository.findByEmail(email);

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.studentsRepository.create(student);

    return right({
      student,
    });
  }
}
