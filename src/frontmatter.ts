import matter from 'gray-matter';
import { Config } from './config';
import { formatTime, generateSlug } from './utils';

export interface FrontmatterData {
  [key: string]: unknown;
}

export interface ParsedContent {
  data: FrontmatterData;
  content: string;
  hasFrontmatter: boolean;
}

export function parseFrontmatter(text: string): ParsedContent {
  const hasFrontmatter = text.trimStart().startsWith('---');

  if (!hasFrontmatter) {
    return {
      data: {},
      content: text,
      hasFrontmatter: false,
    };
  }

  const parsed = matter(text);
  return {
    data: parsed.data as FrontmatterData,
    content: parsed.content,
    hasFrontmatter: true,
  };
}

export function updateFrontmatter(
  parsed: ParsedContent,
  filePath: string,
  config: Config
): FrontmatterData {
  const data = { ...parsed.data };

  if (config.updateUpdatedTime) {
    data[config.updatedTimeKey] = formatTime(config.timeFormat);
  }

  if (config.updateCreatedTime && !data[config.createdTimeKey]) {
    data[config.createdTimeKey] = formatTime(config.timeFormat);
  }

  if (config.updateSlug) {
    data[config.slugKey] = generateSlug(filePath);
  }

  return data;
}

export function stringifyFrontmatter(data: FrontmatterData, content: string): string {
  const result = matter.stringify(content, data);
  return result;
}

export function processFrontmatter(
  text: string,
  filePath: string,
  config: Config
): string {
  const parsed = parseFrontmatter(text);
  const updatedData = updateFrontmatter(parsed, filePath, config);
  return stringifyFrontmatter(updatedData, parsed.content);
}
