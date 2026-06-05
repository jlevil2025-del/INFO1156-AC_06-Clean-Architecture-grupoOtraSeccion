export interface ICommentRepository {
    findByPostId(postId: string): Promise<any[]>
    save(data: { postId: string; content: string; source: string }): Promise<any>
}
