import { Injectable } from '@nestjs/common';
// Ajusta esta importacion a la ubicacion real de tu PrismaService
import { PrismaService } from '../../../prisma/prisma.service'; 
import { IProhibitedWordRepository } from '../../application/ports/prohibited-word.repository.interface';

@Injectable()
export class PrismaProhibitedWordRepository implements IProhibitedWordRepository {
    constructor(private readonly prisma: PrismaService) {}

    async addWord(word: string): Promise<void> {
        await this.prisma.prohibitedWord.create({
            data: { word }
        });
    }

    async getWords(): Promise<string[]> {
        const words = await this.prisma.prohibitedWord.findMany();
        return words.map(record => record.word);
    }
}