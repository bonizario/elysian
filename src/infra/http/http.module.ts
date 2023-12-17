import { Module } from '@nestjs/common';

import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student.use-case';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question.use-case';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions.use-case';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student.use-case';
import { DatabaseModule } from '@/infra/database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { RegisterStudentController } from './controllers/register-student.controller';
import { CryptographyModule } from '../cryptography/cryptography.module';

@Module({
  controllers: [
    AuthenticateController,
    RegisterStudentController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  imports: [DatabaseModule, CryptographyModule],
  providers: [
    AuthenticateStudentUseCase,
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
  ],
})
export class HttpModule {}
