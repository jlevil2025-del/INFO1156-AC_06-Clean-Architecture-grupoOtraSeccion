import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { ILikeRepository } from "../../domain/like.repository.interface"

@Injectable()
export class AddLikeUseCase {
    constructor(
        @Inject("ILikeRepository")
        private readonly likeRepository: ILikeRepository,
    ) {}

    async execute(postId: string, reactionType: string, weight: number) {
        const exists = await this.likeRepository.postExists(postId)
        if (!exists) {
            throw new NotFoundException("Post no encontrado")
        }

        return this.likeRepository.create(postId, reactionType, weight)
    }
}
