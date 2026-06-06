export interface LikeEntity {
    id: string
    postId: string
    reactionType: string
    weight: number
    source: string
    createdAt: Date
}

export interface ILikeRepository {
    postExists(postId: string): Promise<boolean>
    create(
        postId: string,
        reactionType: string,
        weight: number,
    ): Promise<LikeEntity>
}
