import type { StudentsRepository } from '@/domain/forum/application/repositories/students.repository';
import type { Student } from '@/domain/forum/enterprise/entities/student';

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = [];

  async create(student: Student) {
    this.items.push(student);
  }

  async findByEmail(email: string) {
    return this.items.find((item) => item.email === email) ?? null;
  }
}
