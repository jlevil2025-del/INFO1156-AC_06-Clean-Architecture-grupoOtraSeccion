import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common"
import { CreateCommentDto } from "@/posts/posts.dtos"
import { CreateCommentUseCase } from "@/comments/application/create-comment.use-case"
import { ICommentRepository } from "@/comments/domain/comment.repository.interface"

@Controller("api/posts/:id/comments")
export class CommentsController {
    constructor(
        private readonly createCommentUseCase: CreateCommentUseCase,
        @Inject("ICommentRepository")
        private readonly commentRepository: ICommentRepository,
    ) {}

    @Get()
    async list(@Param("id") postId: string) {
        const comments = await this.commentRepository.findByPostId(postId)
        return { total_comments: comments.length, comments }
    }

    @Post()
    create(@Param("id") postId: string, @Body() body: CreateCommentDto) {
        return this.createCommentUseCase.execute(postId, body.content)
    }
}
