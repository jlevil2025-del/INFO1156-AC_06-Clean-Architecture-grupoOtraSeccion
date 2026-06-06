import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { ICommentRepository } from "../../domain/comment.repository.interface"
import { ICommentModerator } from "../ports/comment-moderator.port"

@Injectable()
export class CreateCommentUseCase {
    constructor(
        @Inject("ICommentRepository")
        private readonly commentRepository: ICommentRepository,
        @Inject("IContentModerator")
        private readonly moderator: ICommentModerator,
    ) {}

    async execute(postId: string, content: string) {
        const exists = await this.commentRepository.postExists(postId)
        if (!exists) {
            throw new NotFoundException("Post no encontrado")
        }

        const result = await this.moderator.moderate(content)
        if (!result.approved) {
            throw new BadRequestException(
                result.reason ?? "Comentario bloqueado por moderación",
            )
        }

        return this.commentRepository.create(postId, content)
    }
}
