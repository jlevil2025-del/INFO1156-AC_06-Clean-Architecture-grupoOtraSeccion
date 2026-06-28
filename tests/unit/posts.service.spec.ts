import { BadRequestException } from "@nestjs/common"
import { PostsService } from "../../src/posts/posts.service"

describe("PostsService", () => {
    let service: PostsService
    let mockPrisma: any
    let mockModeration: any

    beforeEach(() => {
        mockPrisma = {
            post: {
                create: jest.fn(),
                findMany: jest.fn(),
                findUnique: jest.fn(),
            },
        }
        mockModeration = {
            moderate: jest.fn(),
        }
        service = new PostsService(mockPrisma as any, mockModeration as any)
    })

    describe("create (deprecated)", () => {
        it("should throw when moderation rejects", async () => {
            mockModeration.moderate.mockResolvedValue({
                approved: false,
                reason: "Contiene spam",
            })

            await expect(
                service.create({
                    title: "spam",
                    description: "description",
                } as any),
            ).rejects.toThrow(BadRequestException)

            expect(mockPrisma.post.create).not.toHaveBeenCalled()
        })

        it("should use default message when moderation rejects without reason", async () => {
            mockModeration.moderate.mockResolvedValue({ approved: false })

            await expect(
                service.create({ title: "x", description: "y" } as any),
            ).rejects.toThrow(BadRequestException)
        })

        it("should create post when moderation approves", async () => {
            mockModeration.moderate.mockResolvedValue({ approved: true })
            mockPrisma.post.create.mockResolvedValue({ id: "1", title: "test" })

            const result = await service.create({
                title: "test",
                description: "valid description",
            } as any)

            expect(result).toEqual({ id: "1", title: "test" })
            expect(mockPrisma.post.create).toHaveBeenCalledTimes(1)
        })
    })
})
