import { Injectable } from '@nestjs/common';

import { left, right, type Either } from '@/core/either';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { Encrypter } from '../cryptography/encrypter';
import { HashComparator } from '../cryptography/hash-comparator';
import { StudentsRepository } from '../repositories/students.repository';

type AuthenticateStudentUseCaseRequest = {
  email: string;
  password: string;
};

type AuthenticateStudentUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly encrypter: Encrypter,
    private readonly hashComparator: HashComparator,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email);

    if (!student) {
      return left(new InvalidCredentialsError());
    }

    const isPasswordValid = await this.hashComparator.compare(
      password,
      student.password,
    );

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toValue(),
    });

    return right({
      accessToken,
    });
  }
}
