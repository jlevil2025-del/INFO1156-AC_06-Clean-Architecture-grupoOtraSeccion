// Nota: 'FeedPost' debe ser una entidad de tu dominio, no un modelo de Prisma.
export interface IPostRepository {
    getFeedPosts(categoryId?: string): Promise<any[]>
}
