import { Module } from "@nestjs/common"
import { CommentsController } from "@/comments/comments.controller"
import { CreateCommentUseCase } from "@/comments/application/create-comment.use-case"
import { PrismaCommentRepository } from "@/comments/infrastructure/prisma-comment.repository"
import { ModerationModule } from "@/moderation/moderation.module"
import { ModerationService } from "@/moderation/moderation.service"
import { PostsModule } from "@/posts/posts.module"

@Module({
    imports: [PostsModule, ModerationModule],
    controllers: [CommentsController],
    providers: [
        CreateCommentUseCase,
        {
            provide: "ICommentRepository",
            useClass: PrismaCommentRepository,
        },
        {
            provide: "IContentModerator",
            useExisting: ModerationService,
        },
    ],
})
export class CommentsModule {}
