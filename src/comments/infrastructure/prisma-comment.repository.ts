import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/shared/prisma.service"
import {
    CommentEntity,
    ICommentRepository,
} from "../domain/comment.repository.interface"

@Injectable()
export class PrismaCommentRepository implements ICommentRepository {
    constructor(private readonly prisma: PrismaService) {}

    async postExists(postId: string): Promise<boolean> {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        })
        return post !== null
    }

    async listByPostId(
        postId: string,
    ): Promise<{ total_comments: number; comments: CommentEntity[] }> {
        const comments = await this.prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: "desc" },
        })

        return {
            total_comments: comments.length,
            comments,
        }
    }

    async create(postId: string, content: string): Promise<CommentEntity> {
        return this.prisma.comment.create({
            data: {
                postId,
                content,
                source: "comments-module",
            },
        })
    }
}
