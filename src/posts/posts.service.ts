import { BadRequestException, Injectable } from "@nestjs/common"
import { CreatePostDto } from "@/posts/posts.dtos"
import { ModerationService } from "@/moderation/moderation.service"
import { PrismaService } from "@/shared/prisma.service"

@Injectable()
export class PostsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly moderationService: ModerationService,
    ) {}

    /**
     * @deprecated Reemplazado por CreatePostUseCase (Clean Architecture).
     * Se mantiene temporalmente por retrocompatibilidad.
     */
    async create(data: CreatePostDto) {
        const text = `${data.title} ${data.description}`
        const moderation = await this.moderationService.moderate(text)

        if (!moderation.approved) {
            throw new BadRequestException(
                moderation.reason ?? "Post bloqueado por moderación",
            )
        }

        return await this.prisma.post.create({ data })
    }

    findAll() {
        return this.prisma.post.findMany({
            orderBy: { createdAt: "desc" },
        })
    }

    findById(id: string) {
        return this.prisma.post.findUnique({ where: { id } })
    }

}
