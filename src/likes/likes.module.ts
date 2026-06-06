import { Module } from "@nestjs/common"
import { LikesController } from "./likes.controller"
import { AddLikeUseCase } from "./application/use-cases/add-like.use-case"
import { PrismaLikeRepository } from "./infrastructure/prisma-like.repository"

@Module({
    controllers: [LikesController],
    providers: [
        {
            provide: "ILikeRepository",
            useClass: PrismaLikeRepository,
        },
        AddLikeUseCase,
    ],
})
export class LikesModule {}
