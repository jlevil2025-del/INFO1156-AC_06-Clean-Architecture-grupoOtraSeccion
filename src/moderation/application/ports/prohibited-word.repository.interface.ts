export interface IProhibitedWordRepository {
    addWord(word: string, category: string): Promise<void>
    getWords(): Promise<string[]>
}