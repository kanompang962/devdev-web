import { Pipe, PipeTransform } from '@angular/core';
import { truncate } from '../utils/string.utils';

@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength = 100, suffix = '...'): string {
    return truncate(value, maxLength, suffix);
  }
}