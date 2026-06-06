export interface CommentModerationResult {
    approved: boolean
    reason?: string
}

export interface ICommentModerator {
    moderate(text: string): Promise<CommentModerationResult>
}
