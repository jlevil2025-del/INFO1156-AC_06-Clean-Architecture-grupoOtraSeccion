import { IContentModerator } from '../interfaces/content-moderator.interface';

export class FuzzyModeratorService implements IContentModerator {
    // Almacenamos las palabras en el estado del servicio de dominio al instanciarlo
    constructor(private readonly prohibitedWords: string[]) {}

    public moderate(text: string): boolean {
        for (const word of this.prohibitedWords) {
            const regex = this.buildFuzzyRegex(word);
            if (regex.test(text)) {
                return true; // Contiene contenido prohibido
            }
        }
        return false;
    }

    private buildFuzzyRegex(word: string): RegExp {
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const fuzzyPattern = escapedWord.split('').join('[\\W_]*');
        return new RegExp(fuzzyPattern, 'i');
    }
}