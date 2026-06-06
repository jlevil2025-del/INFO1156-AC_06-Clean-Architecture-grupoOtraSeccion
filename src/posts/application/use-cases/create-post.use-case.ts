import { Injectable, Inject, BadRequestException } from "@nestjs/common"
import { IPostRepository } from "../../domain/interfaces/i-post.repository"
// Ojo: usa el truco de borrar la ruta y usar ../../ si esta línea te marca rojo
import { IContentModerator } from "../../domain/interfaces/i-content-moderator.interface"
import { CreatePostDto } from "../../posts.dtos"

@Injectable()
export class CreatePostUseCase {
    constructor(
        @Inject("IContentModerator")
        private readonly contentModerator: IContentModerator,
        @Inject("IPostRepository")
        private readonly postRepository: IPostRepository,
    ) {}

    async execute(postDto: CreatePostDto) {
        // Concatenamos título y descripción para que la validación sea completa
        const textToModerate = `${postDto.title} ${postDto.description}`
        const isClean = await this.contentModerator.moderate(textToModerate)

        if (!isClean) {
            throw new BadRequestException(
                "Publicación prohibida por moderación.",
            )
        }

        return this.postRepository.save(postDto)
    }
}
