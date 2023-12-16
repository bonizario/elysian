import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/infra/database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';

@Module({
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  imports: [DatabaseModule],
})
export class HttpModule {}
