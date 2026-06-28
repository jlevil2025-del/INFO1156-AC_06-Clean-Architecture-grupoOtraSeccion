import { Injectable } from "@nestjs/common"
import {
    IPostRepository,
    IPostData,
} from "../../domain/interfaces/i-post.repository"
import { PrismaService } from "../../../shared/prisma.service"

@Injectable()
export class PrismaPostRepository implements IPostRepository {
    constructor(private readonly prisma: PrismaService) {}

    async save(postData: IPostData): Promise<any> {
        return this.prisma.post.create({
            data: {
                title: postData.title,
                description: postData.description,
                imageUrl: postData.imageUrl,
                ...(postData.categoryId && { categoryId: postData.categoryId }),
            },
        })
    }

    async getFeedPosts(categoryId?: string): Promise<any[]> {
        const posts = await this.prisma.post.findMany({
            where: categoryId ? { categoryId } : undefined,
            include: { comments: true, likes: true, category: true },
        })

        return posts.map((post) => ({
            id: post.id,
            title: post.title,
            description: post.description,
            imageUrl: post.imageUrl,
            categoryId: post.categoryId,
            category: post.category?.name ?? null,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            likesCount: post.likes.reduce(
                (sum: number, l: { weight: number }) => sum + l.weight,
                0,
            ),
            commentsCount: post.comments.length,
            relevanceScore: 0,
        }))
    }
}
