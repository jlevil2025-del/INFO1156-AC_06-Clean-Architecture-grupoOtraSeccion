import { Injectable } from '@nestjs/common';
import { IContentModerator } from '../../domain/interfaces/i-content-moderator.interface';

@Injectable()
export class MockContentModeratorAdapter implements IContentModerator {
  async moderate(content: string): Promise<boolean> {
    return true;
  }
}
