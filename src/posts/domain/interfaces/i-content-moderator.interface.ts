// src/posts/domain/interfaces/i-content-moderator.interface.ts
export interface IContentModerator {
    moderate(content: string): Promise<boolean>
}
