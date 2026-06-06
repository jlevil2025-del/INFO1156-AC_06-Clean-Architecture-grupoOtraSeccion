// src/posts/infrastructure/controllers/posts.controller.ts
import { Controller, Post, Body } from "@nestjs/common"
import { CreatePostUseCase } from "../../application/use-cases/create-post.use-case"
import { CreatePostDto } from "../../posts.dtos"

@Controller("posts")
export class PostsController {
    constructor(private readonly createPostUseCase: CreatePostUseCase) {}

    @Post()
    async create(@Body() createPostDto: CreatePostDto) {
        // Ahora el controlador está "limpio", solo recibe la petición y se la pasa al Caso de Uso
        return this.createPostUseCase.execute(createPostDto)
    }

    // Nota: Si hay otros métodos aquí (como un GET para ver el feed),
    // déjalos tal como estaban por ahora, solo estamos refactorizando el POST.
}
