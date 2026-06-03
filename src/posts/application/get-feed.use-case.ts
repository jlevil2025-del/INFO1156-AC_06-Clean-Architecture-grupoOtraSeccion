import { Inject, Injectable } from "@nestjs/common"
import { IPostRepository } from "../domain/post.repository.interface"
import { GetFeedInput } from "./get-feed.input"
import { FeedRankingStrategyFactory } from "../feed-ranking.strategy"

@Injectable()
export class GetFeedUseCase {
    constructor(
        @Inject("IPostRepository")
        private readonly postRepository: IPostRepository,
        private readonly feedRankingFactory: FeedRankingStrategyFactory,
    ) {}

    async execute(input: GetFeedInput) {
        const mode = input.mode ?? "latest"

        // 1. Obtener datos crudos mediante la interfaz abstracta
        const feedPosts = await this.postRepository.getFeedPosts(
            input.categoryId,
        )

        // 2. Aplicar la regla de negocio (Strategy Pattern)
        const rankedPosts = this.feedRankingFactory
            .forMode(mode)
            .rank(feedPosts)

        return {
            mode,
            count: rankedPosts.length,
            rows: rankedPosts,
        }
    }
}
