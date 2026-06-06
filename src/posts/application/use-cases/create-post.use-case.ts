import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IPostRepository } from '../../domain/interfaces/i-post.repository';
import { IContentModerator } from '../../domain/interfaces/i-content-moderator.interface';
import { CreatePostDto } from '../../posts.dtos';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject('IContentModerator') private readonly contentModerator: IContentModerator,
    @Inject('IPostRepository') private readonly postRepository: IPostRepository,
  ) {}

  async execute(postDto: CreatePostDto) {
    // 1. Concatenamos título y descripción para que la validación sea completa
    const textToModerate = `${postDto.title} ${postDto.description}`;
    const isClean = await this.contentModerator.moderate(textToModerate);

    // 2. Si falla, lanza excepción
    if (!isClean) {
      throw new BadRequestException('El contenido de la publicación fue bloqueado por spam.');
    }

    // 3. Si pasa, envía los datos al repositorio
    return this.postRepository.save(postDto);
  }
}