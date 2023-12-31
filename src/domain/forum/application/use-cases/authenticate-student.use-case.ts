import { Injectable } from '@nestjs/common';

import { left, right, type Either } from '@/core/either';

import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { HashComparator } from '@/domain/forum/application/cryptography/hash-comparator';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { StudentsRepository } from '@/domain/forum/application/repositories/students.repository';

import { InvalidCredentialsError } from './errors/invalid-credentials-error';

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
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email);

    if (!student) {
      await this.hashGenerator.hash(password); //avoidance of timing attacks

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
