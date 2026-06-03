import { Injectable } from "@nestjs/common"
import { IPostRepository } from "../domain/post.repository.interface"
import { PrismaService } from "@/shared/prisma.service" // Ajusta la ruta si es necesario

@Injectable()
export class PrismaPostRepository implements IPostRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getFeedPosts(categoryId?: string): Promise<any[]> {
        // La consulta debe mantener la lógica original del antiguo PostsService
        const posts = await this.prisma.post.findMany({
            //
            where: categoryId ? { categoryId } : undefined,
            include: { comments: true, likes: true, category: true },
        })

        // Debes mantener el mapeo original para no romper la estrategia de ordenamiento
        return posts.map((post) => ({
            id: post.id,
            title: post.title,
            description: post.description,
            imageUrl: post.imageUrl,
            categoryId: post.categoryId,
            category: post.category?.name ?? null,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            likesCount: post.likes.reduce((sum, l) => sum + l.weight, 0),
            commentsCount: post.comments.length,
            relevanceScore: 0,
        }))
    }
}
