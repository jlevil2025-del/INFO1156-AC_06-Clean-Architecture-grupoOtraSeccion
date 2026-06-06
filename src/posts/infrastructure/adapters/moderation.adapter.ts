import { Injectable } from "@nestjs/common"
import { ModerationService } from "../../../moderation/moderation.service"
import { IContentModerator } from "../../domain/interfaces/i-content-moderator.interface"

@Injectable()
export class ModerationAdapter implements IContentModerator {
    constructor(private readonly moderationService: ModerationService) {}

    async moderate(content: string): Promise<boolean> {
        const result = await this.moderationService.moderate(content)
        return result.approved
    }
}
