import { IContentModerator } from "../interfaces/content-moderator.interface"

export class FuzzyModeratorService implements IContentModerator {
    private words: string[] = []

    loadWords(prohibitedWords: string[]): void {
        this.words = prohibitedWords
    }

    private buildFuzzyRegex(word: string): RegExp {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        return new RegExp(escaped.split("").join("[^a-zA-Z0-9]*"), "gi")
    }

    moderate(text: string): boolean {
        for (const word of this.words) {
            const regex = this.buildFuzzyRegex(word)
            if (regex.test(text)) {
                return false
            }
        }
        return true
    }
}
