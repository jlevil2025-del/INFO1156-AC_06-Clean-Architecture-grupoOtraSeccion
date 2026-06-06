import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { ICommentRepository } from "../../domain/comment.repository.interface"

@Injectable()
export class ListCommentsUseCase {
    constructor(
        @Inject("ICommentRepository")
        private readonly commentRepository: ICommentRepository,
    ) {}

    async execute(postId: string) {
        const exists = await this.commentRepository.postExists(postId)
        if (!exists) {
            throw new NotFoundException("Post no encontrado")
        }

        return this.commentRepository.listByPostId(postId)
    }
}
