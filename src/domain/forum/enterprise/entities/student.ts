import { Entity } from '@/core/entities/entity';
import type { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface StudentProps {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Student extends Entity<StudentProps> {
  get email() {
    return this.props.email;
  }

  get name() {
    return this.props.name;
  }

  get password() {
    return this.props.password;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<StudentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const student = new Student(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return student;
  }
}
