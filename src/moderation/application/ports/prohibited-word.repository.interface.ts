export interface IProhibitedWordRepository {
    save(word: string, category: string): Promise<void>
    findAll(): Promise<Array<{ id: string; word: string; category: string; createdAt: Date }>>
}
