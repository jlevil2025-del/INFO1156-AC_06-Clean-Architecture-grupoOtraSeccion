import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/shared/prisma.service"
import { IProhibitedWordRepository } from "../../application/ports/prohibited-word.repository.interface"

@Injectable()
export class PrismaProhibitedWordRepository
    implements IProhibitedWordRepository
{
    constructor(private readonly prisma: PrismaService) {}

    async addWord(word: string, category: string): Promise<void> {
        await this.prisma.prohibitedWord.create({
            data: {
                word,
                category,
            },
        })
    }

    async getWords(): Promise<string[]> {
        const words = await this.prisma.prohibitedWord.findMany()
        return words.map((record) => record.word)
    }
}