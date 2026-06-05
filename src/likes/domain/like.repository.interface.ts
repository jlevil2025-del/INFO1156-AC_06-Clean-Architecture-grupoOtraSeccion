export interface ILikeRepository {
    save(data: {
        postId: string
        reactionType: string
        weight: number
        source: string
    }): Promise<any>
}
