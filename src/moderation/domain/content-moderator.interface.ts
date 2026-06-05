export type ModerationResult = {
    approved: boolean
    reason?: string
    category?: string
}

export interface IContentModerator {
    moderate(text: string): Promise<ModerationResult>
}
