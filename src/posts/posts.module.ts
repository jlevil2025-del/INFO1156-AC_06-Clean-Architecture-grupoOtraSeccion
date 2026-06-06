import { Module } from "@nestjs/common"
import { PostsController } from "./infrastructure/controllers/posts.controller"
import { CreatePostUseCase } from "./application/use-cases/create-post.use-case"
import { PrismaPostRepository } from "./infrastructure/repositories/prisma-post.repository"
import { PrismaModule } from "../shared/prisma.module"
import { PostsService } from "./posts.service"

@Module({
    imports: [PrismaModule],
    controllers: [PostsController],
    providers: [
        CreatePostUseCase,
        {
            provide: "IPostRepository",
            useClass: PrismaPostRepository,
        },
        
        PostsService,
    ],

    exports: [PostsService],
})
export class PostsModule {}
