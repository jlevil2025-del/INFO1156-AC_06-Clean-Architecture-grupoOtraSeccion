import { Controller, Get, Post, Body, Query } from "@nestjs/common"
import { CreatePostUseCase } from "../../application/use-cases/create-post.use-case"
import { PostsService } from "../../posts.service"
import { FeedRankingStrategyFactory } from "../../feed-ranking.strategy"
import { CreatePostDto, FeedQueryDto } from "../../posts.dtos"

@Controller("api/posts")
export class PostsController {
    constructor(
        private readonly createPostUseCase: CreatePostUseCase,
        private readonly postsService: PostsService,
        private readonly feedRankingFactory: FeedRankingStrategyFactory,
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
        const mode = query.mode ?? "latest"
        const feedPosts = await this.postsService.getFeedPosts(query.categoryId)
        const ranked = this.feedRankingFactory.forMode(mode).rank(feedPosts)
        return { mode, count: ranked.length, rows: ranked }
    }
}
