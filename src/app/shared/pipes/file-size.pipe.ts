import { Pipe, PipeTransform } from '@angular/core';
import { formatBytes } from '../utils/string.utils';

@Pipe({ name: 'fileSize', standalone: true })
export class FileSizePipe implements PipeTransform {
  transform(bytes: number, decimals = 2): string {
    return formatBytes(bytes, decimals);
  }
}