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
            },
        })
    }
}
