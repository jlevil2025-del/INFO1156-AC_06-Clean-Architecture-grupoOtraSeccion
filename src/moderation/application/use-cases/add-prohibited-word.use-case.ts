import { IProhibitedWordRepository } from '../ports/prohibited-word.repository.interface';

export class AddProhibitedWordUseCase {
    constructor(private readonly repository: IProhibitedWordRepository) {}

    async execute(word: string): Promise<void> {
        await this.repository.addWord(word.toLowerCase().trim());
    }
}