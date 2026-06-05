import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { ILikeRepository } from "../domain/like.repository.interface"
import { PostsService } from "@/posts/posts.service"

@Injectable()
export class AddLikeUseCase {
    constructor(
        @Inject("ILikeRepository")
        private readonly likeRepository: ILikeRepository,
        private readonly postsService: PostsService,
    ) {}

    async execute(
        postId: string,
        reactionType: string,
        weight: number,
    ): Promise<any> {
        const post = await this.postsService.findById(postId)
        if (!post) {
            throw new NotFoundException("Post no encontrado")
        }

        if (weight < 1) {
            throw new BadRequestException("El peso debe ser al menos 1")
        }

        return this.likeRepository.save({
            postId,
            reactionType,
            weight,
            source: "likes-module",
        })
    }
}
