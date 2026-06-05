import { Module } from "@nestjs/common"
import { LikesController } from "@/likes/likes.controller"
import { AddLikeUseCase } from "@/likes/application/add-like.use-case"
import { PrismaLikeRepository } from "@/likes/infrastructure/prisma-like.repository"
import { PostsModule } from "@/posts/posts.module"

@Module({
    imports: [PostsModule],
    controllers: [LikesController],
    providers: [
        AddLikeUseCase,
        {
            provide: "ILikeRepository",
            useClass: PrismaLikeRepository,
        },
    ],
})
export class LikesModule {}
