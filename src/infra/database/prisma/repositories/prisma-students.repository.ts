import { Injectable } from '@nestjs/common';

import { StudentsRepository } from '@/domain/forum/application/repositories/students.repository';
import { Student } from '@/domain/forum/enterprise/entities/student';

import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(student: Student) {
    const data = PrismaStudentMapper.toPrisma(student);

    await this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string) {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return student ? PrismaStudentMapper.toDomain(student) : null;
  }
}
