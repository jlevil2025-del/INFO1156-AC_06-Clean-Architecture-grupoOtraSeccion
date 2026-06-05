import { IProhibitedWordRepository } from "../ports/prohibited-word.repository.interface"

export class GetProhibitedWordsUseCase {
    constructor(private readonly repository: IProhibitedWordRepository) {}

    async execute() {
        return await this.repository.findAll()
    }
}
