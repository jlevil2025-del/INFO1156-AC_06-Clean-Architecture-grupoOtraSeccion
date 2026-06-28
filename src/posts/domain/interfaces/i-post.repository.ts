export interface IPostData {
    title: string
    description: string
    imageUrl: string
    categoryId?: string
}

export interface IPostRepository {
    save(postData: IPostData): Promise<any>
    getFeedPosts(categoryId?: string): Promise<any[]>
}
