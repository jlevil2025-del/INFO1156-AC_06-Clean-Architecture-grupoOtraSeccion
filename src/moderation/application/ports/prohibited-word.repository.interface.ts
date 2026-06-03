export interface IProhibitedWordRepository {
    addWord(word: string): Promise<void>;
    getWords(): Promise<string[]>;
}