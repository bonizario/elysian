import { Entity } from '@/core/entities/entity';
import type { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface InstructorProps {
  name: string;
}

export class Instructor extends Entity<InstructorProps> {
  public static create(props: InstructorProps, id?: UniqueEntityID) {
    const answer = new Instructor(props, id);

    return answer;
  }
}