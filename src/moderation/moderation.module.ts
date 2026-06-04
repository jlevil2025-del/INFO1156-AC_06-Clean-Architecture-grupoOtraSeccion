import { Module } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { FuzzyModeratorService } from "./domain/services/fuzzy-moderator.service"
import { PrismaProhibitedWordRepository } from "./infrastructure/repositories/prisma-prohibited-word.repository"
import { AddProhibitedWordUseCase } from "./application/use-cases/add-prohibited-word.use-case"
import { GetProhibitedWordsUseCase } from "./application/use-cases/get-prohibited-words.use-case"
import { IProhibitedWordRepository } from "./application/ports/prohibited-word.repository.interface"

@Module({
    providers: [
        PrismaService,
        FuzzyModeratorService,
        {
            provide: "IProhibitedWordRepository",
            useClass: PrismaProhibitedWordRepository,
        },
        {
            provide: AddProhibitedWordUseCase,
            useFactory: (repository: IProhibitedWordRepository) => {
                return new AddProhibitedWordUseCase(repository)
            },
            inject: ["IProhibitedWordRepository"],
        },
        {
            provide: GetProhibitedWordsUseCase,
            useFactory: (repository: IProhibitedWordRepository) => {
                return new GetProhibitedWordsUseCase(repository)
            },
            inject: ["IProhibitedWordRepository"],
        },
    ],
    exports: [
        FuzzyModeratorService,
        AddProhibitedWordUseCase,
        GetProhibitedWordsUseCase,
    ],
})
export class ModerationModule {}