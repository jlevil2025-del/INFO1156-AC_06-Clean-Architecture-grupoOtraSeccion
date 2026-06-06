import { Module } from "@nestjs/common"
import { PostsController } from "./infrastructure/controllers/posts.controller"
import { CreatePostUseCase } from "./application/use-cases/create-post.use-case"
import { PrismaPostRepository } from "./infrastructure/repositories/prisma-post.repository"
import { PrismaModule } from "../shared/prisma.module"
import { PostsService } from "./posts.service"
import { FeedRankingStrategyFactory } from "./feed-ranking.strategy"

import { ModerationModule } from "../moderation/moderation.module"
import { ModerationAdapter } from "./infrastructure/adapters/moderation.adapter"

@Module({
    imports: [PrismaModule, ModerationModule],
    controllers: [PostsController],
    providers: [
        CreatePostUseCase,
        {
            provide: "IPostRepository",
            useClass: PrismaPostRepository,
        },
        {
            provide: "IContentModerator",
            useClass: ModerationAdapter,
        },
        PostsService,
        FeedRankingStrategyFactory,
    ],
    exports: [PostsService],
})
export class PostsModule {}
