import { Body, Controller, Param, Post } from "@nestjs/common"
import { AddLikeDto } from "@/posts/posts.dtos"
import { AddLikeUseCase } from "./application/use-cases/add-like.use-case"

@Controller("api/posts/:id/likes")
export class LikesController {
    constructor(private readonly addLikeUseCase: AddLikeUseCase) {}

    @Post()
    create(@Param("id") postId: string, @Body() body: AddLikeDto) {
        const reactionType = body.reactionType ?? "like"
        const weight = body.weight ?? 1
        return this.addLikeUseCase.execute(postId, reactionType, weight)
    }
}
