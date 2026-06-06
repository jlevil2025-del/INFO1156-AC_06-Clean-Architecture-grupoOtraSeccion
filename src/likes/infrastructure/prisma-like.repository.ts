import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/shared/prisma.service"
import {
    ILikeRepository,
    LikeEntity,
} from "../domain/like.repository.interface"

@Injectable()
export class PrismaLikeRepository implements ILikeRepository {
    constructor(private readonly prisma: PrismaService) {}

    async postExists(postId: string): Promise<boolean> {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        })
        return post !== null
    }

    async create(
        postId: string,
        reactionType: string,
        weight: number,
    ): Promise<LikeEntity> {
        return this.prisma.like.create({
            data: {
                postId,
                reactionType,
                weight,
                source: "likes-module",
            },
        })
    }
}
