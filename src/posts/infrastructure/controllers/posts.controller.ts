import { Controller, Get, Post, Body, Query } from "@nestjs/common"
import { CreatePostUseCase } from "../../application/use-cases/create-post.use-case"
import { GetFeedUseCase } from "../../application/get-feed.use-case"
import { PostsService } from "../../posts.service"
import { CreatePostDto, FeedQueryDto } from "../../posts.dtos"

@Controller("api/posts")
export class PostsController {
    constructor(
        private readonly createPostUseCase: CreatePostUseCase,
        private readonly getFeedUseCase: GetFeedUseCase,
        private readonly postsService: PostsService,
    ) {}

    @Post()
    async create(@Body() createPostDto: CreatePostDto) {
        const created = await this.createPostUseCase.execute(createPostDto)
        return { ok: true, payload: created }
    }

    @Get()
    async findAll() {
        const posts = await this.postsService.findAll()
        return { total: posts.length, items: posts }
    }

    @Get("feed")
    async getFeed(@Query() query: FeedQueryDto) {
        return this.getFeedUseCase.execute(query)
    }
}
