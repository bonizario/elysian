import { Comment as PrismaComment, User as PrismaUser } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser;
};

export class PrismaCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      authorId: new UniqueEntityID(raw.author.id),
      commentId: new UniqueEntityID(raw.id),
      authorName: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
