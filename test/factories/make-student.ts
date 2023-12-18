import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  Student,
  type StudentProps,
} from '@/domain/forum/enterprise/entities/student';

import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const student = Student.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return student;
}

@Injectable()
export class StudentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}) {
    const student = makeStudent(data);

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    });

    return student;
  }
}
