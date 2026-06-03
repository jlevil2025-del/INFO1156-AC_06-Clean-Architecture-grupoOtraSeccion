import { IProhibitedWordRepository } from '../ports/prohibited-word.repository.interface';

export class GetProhibitedWordsUseCase {
    constructor(private readonly repository: IProhibitedWordRepository) {}

    async execute(): Promise<string[]> {
        return await this.repository.getWords();
    }
}