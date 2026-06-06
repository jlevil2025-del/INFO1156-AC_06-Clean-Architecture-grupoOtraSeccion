export interface IPostData {
    title: string
    description: string
    imageUrl: string
}

export interface IPostRepository {
    save(postData: IPostData): Promise<any>
}
