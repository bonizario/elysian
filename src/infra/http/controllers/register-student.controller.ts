import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common';
import { z } from 'zod';

import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student.use-case';

import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

const registerStudentBodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(registerStudentBodySchema);

type RegisterStudentBody = z.infer<typeof registerStudentBodySchema>;

@Public()
@Controller('/accounts')
export class RegisterStudentController {
  constructor(private readonly registerStudent: RegisterStudentUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: RegisterStudentBody) {
    const { email, name, password } = body;

    const result = await this.registerStudent.execute({
      email,
      name,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
