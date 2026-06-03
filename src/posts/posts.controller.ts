import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { PostsService } from "@/posts/posts.service"
import { CreatePostDto, FeedQueryDto } from "@/posts/posts.dtos"
import { GetFeedUseCase } from "./application/get-feed.use-case"

@Controller("api/posts")
export class PostsController {
    constructor(
        // Servicio antiguo (Se mantiene temporalmente para no romper las rutas de tus compañeros)
        private readonly postsService: PostsService,
        // Tu nuevo Caso de Uso Inyectado
        private readonly getFeedUseCase: GetFeedUseCase,
    ) {}

    @Post()
    async create(@Body() body: CreatePostDto) {
        // Bárbara refactorizará esto en su rama
        const created = await this.postsService.create(body)
        return { ok: true, payload: created }
    }

    @Get()
    async findAll() {
        // Código legacy intacto
        const posts = await this.postsService.findAll()
        return { total: posts.length, items: posts }
    }

    @Get("feed")
    async getFeed(@Query() query: FeedQueryDto) {
        // Tu refactorización limpia delegando al Caso de Uso
        return await this.getFeedUseCase.execute({
            mode: query.mode as string,
            categoryId: query.categoryId,
        })
    }
}
