import { Injectable } from "@nestjs/common"
import { ICommentRepository } from "../domain/comment.repository.interface"
import { PrismaService } from "@/shared/prisma.service"

@Injectable()
export class PrismaCommentRepository implements ICommentRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByPostId(postId: string): Promise<any[]> {
        return this.prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: "desc" },
        })
    }

    async save(data: {
        postId: string
        content: string
        source: string
    }): Promise<any> {
        return this.prisma.comment.create({ data })
    }
}
