import { Module } from '@nestjs/common';

import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student.use-case';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer.use-case';
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer.use-case';
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question.use-case';
import { CreateAnswerUseCase } from '@/domain/forum/application/use-cases/create-answer.use-case';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question.use-case';
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment.use-case';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer.use-case';
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment.use-case';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question.use-case';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer.use-case';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question.use-case';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments.use-case';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers.use-case';
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments.use-case';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions.use-case';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug.use-case';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student.use-case';

import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { AuthenticateController } from './controllers/authenticate.controller';
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller';
import { CommentOnAnswerController } from './controllers/comment-on-answer.controller';
import { CommentOnQuestionController } from './controllers/comment-on-question.controller';
import { CreateAnswerController } from './controllers/create-answer.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment.controller';
import { DeleteAnswerController } from './controllers/delete-answer.controller';
import { DeleteQuestionCommentController } from './controllers/delete-question-comment.controller';
import { DeleteQuestionController } from './controllers/delete-question.controller';
import { EditAnswerController } from './controllers/edit-answer.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments.controller';
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller';
import { FetchQuestionCommentsController } from './controllers/fetch-question-comments.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { RegisterStudentController } from './controllers/register-student.controller';
import { UploadAttachmentController } from './controllers/upload-attachment.controller';

@Module({
  controllers: [
    AuthenticateController,
    ChooseQuestionBestAnswerController,
    CommentOnAnswerController,
    CommentOnQuestionController,
    CreateAnswerController,
    CreateQuestionController,
    DeleteAnswerCommentController,
    DeleteAnswerController,
    DeleteQuestionCommentController,
    DeleteQuestionController,
    EditAnswerController,
    EditQuestionController,
    FetchAnswerCommentsController,
    FetchQuestionAnswersController,
    FetchQuestionCommentsController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    RegisterStudentController,
    UploadAttachmentController,
  ],
  imports: [DatabaseModule, CryptographyModule],
  providers: [
    AuthenticateStudentUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnAnswerUseCase,
    CommentOnQuestionUseCase,
    CreateAnswerUseCase,
    CreateQuestionUseCase,
    DeleteAnswerCommentUseCase,
    DeleteAnswerUseCase,
    DeleteQuestionCommentUseCase,
    DeleteQuestionUseCase,
    EditAnswerUseCase,
    EditQuestionUseCase,
    FetchAnswerCommentsUseCase,
    FetchQuestionAnswersUseCase,
    FetchQuestionCommentsUseCase,
    FetchRecentQuestionsUseCase,
    GetQuestionBySlugUseCase,
    RegisterStudentUseCase,
  ],
})
export class HttpModule {}
