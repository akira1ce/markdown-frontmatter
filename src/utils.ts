import dayjs from 'dayjs';
import * as path from 'path';

export function formatTime(format: string): string {
  return dayjs().format(format);
}

export function generateSlug(filePath: string): string {
  const basename = path.basename(filePath);
  const ext = path.extname(basename);
  return basename.slice(0, -ext.length);
}
