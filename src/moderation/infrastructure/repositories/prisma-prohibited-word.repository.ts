import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/shared/prisma.service"
import { IProhibitedWordRepository } from "../../application/ports/prohibited-word.repository.interface"

@Injectable()
export class PrismaProhibitedWordRepository implements IProhibitedWordRepository {
    constructor(private readonly prisma: PrismaService) {}

    async save(word: string, category: string): Promise<void> {
        await this.prisma.prohibitedWord.create({ data: { word, category } })
    }

    async findAll() {
        return await this.prisma.prohibitedWord.findMany({
            orderBy: { createdAt: "desc" },
        })
    }
}
