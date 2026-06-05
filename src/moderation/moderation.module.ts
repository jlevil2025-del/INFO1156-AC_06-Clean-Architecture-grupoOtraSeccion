import { Module } from "@nestjs/common"
import { PrismaService } from "@/shared/prisma.service"
import { ModerationController } from "@/moderation/moderation.controller"
import { ModerationService } from "@/moderation/moderation.service"
import { FuzzyModeratorService } from "./domain/services/fuzzy-moderator.service"
import { PrismaProhibitedWordRepository } from "@/moderation/infrastructure/repositories/prisma-prohibited-word.repository"
import { AddProhibitedWordUseCase } from "@/moderation/application/use-cases/add-prohibited-word.use-case"
import { GetProhibitedWordsUseCase } from "@/moderation/application/use-cases/get-prohibited-words.use-case"

@Module({
    controllers: [ModerationController],
    providers: [
        PrismaService,
        FuzzyModeratorService,
        ModerationService,
        {
            provide: "IProhibitedWordRepository",
            useClass: PrismaProhibitedWordRepository,
        },
        {
            provide: AddProhibitedWordUseCase,
            useFactory: (repo) => new AddProhibitedWordUseCase(repo),
            inject: ["IProhibitedWordRepository"],
        },
        {
            provide: GetProhibitedWordsUseCase,
            useFactory: (repo) => new GetProhibitedWordsUseCase(repo),
            inject: ["IProhibitedWordRepository"],
        },
    ],
    exports: [ModerationService, FuzzyModeratorService, AddProhibitedWordUseCase, GetProhibitedWordsUseCase],
})
export class ModerationModule {}
