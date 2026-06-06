export interface CommentEntity {
    id: string
    postId: string
    content: string
    source: string
    createdAt: Date
    updatedAt: Date
}

export interface ICommentRepository {
    postExists(postId: string): Promise<boolean>
    listByPostId(
        postId: string,
    ): Promise<{ total_comments: number; comments: CommentEntity[] }>
    create(postId: string, content: string): Promise<CommentEntity>
}
