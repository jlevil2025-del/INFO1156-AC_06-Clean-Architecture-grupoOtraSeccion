import { Body, Controller, Param, Post } from "@nestjs/common"
import { AddLikeDto } from "@/posts/posts.dtos"
import { AddLikeUseCase } from "@/likes/application/add-like.use-case"

@Controller("api/posts/:id/likes")
export class LikesController {
    constructor(private readonly addLikeUseCase: AddLikeUseCase) {}

    @Post()
    create(@Param("id") postId: string, @Body() body: AddLikeDto) {
        return this.addLikeUseCase.execute(
            postId,
            body.reactionType ?? "like",
            body.weight ?? 1,
        )
    }
}
