import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

// Handbook rule: Pipes = Validation / Transformation
@Injectable()
export class ParseIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new BadRequestException('Invalid ID');
    }
    return value.trim();
  }
}
