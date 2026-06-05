import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { ICommentRepository } from "../domain/comment.repository.interface"
import { IContentModerator } from "@/moderation/domain/content-moderator.interface"
import { PostsService } from "@/posts/posts.service"

@Injectable()
export class CreateCommentUseCase {
    constructor(
        @Inject("ICommentRepository")
        private readonly commentRepository: ICommentRepository,
        @Inject("IContentModerator")
        private readonly contentModerator: IContentModerator,
        private readonly postsService: PostsService,
    ) {}

    async execute(postId: string, content: string): Promise<any> {
        const post = await this.postsService.findById(postId)
        if (!post) {
            throw new NotFoundException("Post no encontrado")
        }

        const moderation = await this.contentModerator.moderate(content)
        if (!moderation.approved) {
            throw new BadRequestException(
                moderation.reason ?? "Comentario bloqueado por moderación",
            )
        }

        return this.commentRepository.save({
            postId,
            content,
            source: "comments-module",
        })
    }
}
