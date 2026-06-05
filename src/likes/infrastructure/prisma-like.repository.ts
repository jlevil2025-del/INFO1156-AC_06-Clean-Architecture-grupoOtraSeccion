import { Injectable } from "@nestjs/common"
import { ILikeRepository } from "../domain/like.repository.interface"
import { PrismaService } from "@/shared/prisma.service"

@Injectable()
export class PrismaLikeRepository implements ILikeRepository {
    constructor(private readonly prisma: PrismaService) {}

    async save(data: {
        postId: string
        reactionType: string
        weight: number
        source: string
    }): Promise<any> {
        return this.prisma.like.create({ data })
    }
}
