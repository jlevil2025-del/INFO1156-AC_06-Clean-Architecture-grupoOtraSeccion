import { Module } from "@nestjs/common"
import { PostsController } from "./posts.controller"
import { PostsService } from "./posts.service" // Mantenido temporalmente por compatibilidad
import { GetFeedUseCase } from "./application/get-feed.use-case"
import { PrismaPostRepository } from "./infrastructure/prisma-post.repository"
import { FeedRankingStrategyFactory } from "./feed-ranking.strategy"
import { ModerationModule } from "@/moderation/moderation.module"
import { PrismaModule } from "../shared/prisma.module"

@Module({
    imports: [PrismaModule, ModerationModule],
    controllers: [PostsController],
    providers: [
        PostsService, // Requerido aún para los endpoints de creación y lista
        GetFeedUseCase,
        FeedRankingStrategyFactory,
        {
            provide: "IPostRepository",
            useClass: PrismaPostRepository,
        },
    ],
    exports: [PostsService], // Exportamos el servicio para que Bárbara pueda seguir usándolo
})
export class PostsModule {}
