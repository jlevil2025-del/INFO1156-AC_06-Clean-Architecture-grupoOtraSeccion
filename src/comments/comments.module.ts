import { Module } from "@nestjs/common"
import { CommentsController } from "./comments.controller"
import { CreateCommentUseCase } from "./application/use-cases/create-comment.use-case"
import { ListCommentsUseCase } from "./application/use-cases/list-comments.use-case"
import { PrismaCommentRepository } from "./infrastructure/prisma-comment.repository"
import { ModerationModule } from "@/moderation/moderation.module"
import { ModerationService } from "@/moderation/moderation.service"

@Module({
    imports: [ModerationModule],
    controllers: [CommentsController],
    providers: [
        {
            provide: "ICommentRepository",
            useClass: PrismaCommentRepository,
        },
        {
            provide: "IContentModerator",
            useExisting: ModerationService,
        },
        CreateCommentUseCase,
        ListCommentsUseCase,
    ],
})
export class CommentsModule {}
