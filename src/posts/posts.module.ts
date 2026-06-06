import { Module } from '@nestjs/common';
import { PostsController } from './infrastructure/controllers/posts.controller';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { PrismaPostRepository } from './infrastructure/repositories/prisma-post.repository';
import { MockContentModeratorAdapter } from './infrastructure/adapters/mock-content-moderator.adapter';
import { PrismaModule } from '../shared/prisma.module'
import { PostsService } from './posts.service'; 

@Module({
  imports: [PrismaModule],
  controllers: [PostsController],
  providers: [
    CreatePostUseCase,
    {
      provide: 'IPostRepository',
      useClass: PrismaPostRepository,
    },
    {
      provide: 'IContentModerator',
      useClass: MockContentModeratorAdapter,
    },
    // 2. Agrega el servicio antiguo a los proveedores
    PostsService, 
  ],

  exports: [PostsService], 
})
export class PostsModule {}