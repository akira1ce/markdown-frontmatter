import matter from 'gray-matter';
import yaml from 'js-yaml';
import { Config, FieldConfig } from './config';
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

function getFieldValue(
  fieldConfig: FieldConfig,
  filePath: string,
  timeFormat: string
): unknown {
  switch (fieldConfig.type) {
    case 'timestamp':
      return formatTime(timeFormat);
    case 'filename':
      return generateSlug(filePath);
    case 'default':
      return fieldConfig.value ?? '';
    default:
      return undefined;
  }
}

export function updateFrontmatter(
  parsed: ParsedContent,
  filePath: string,
  config: Config
): FrontmatterData {
  const data = { ...parsed.data };

  for (const [key, fieldConfig] of Object.entries(config.fields)) {
    const shouldSkip = fieldConfig.onlyIfMissing && data[key] !== undefined;
    if (shouldSkip) {
      continue;
    }

    const value = getFieldValue(fieldConfig, filePath, config.timeFormat);
    if (value !== undefined) {
      data[key] = value;
    }
  }

  return data;
}

export function stringifyFrontmatter(data: FrontmatterData, content: string): string {
  let yamlStr = yaml.dump(data, {
    quotingType: '"',
    forceQuotes: false,
    lineWidth: -1,
  });

  // Remove quotes from datetime values like "2025-12-31 15:42:53"
  yamlStr = yamlStr.replace(/: ["'](\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})["']/g, ': $1');

  // Ensure content starts with newline
  const normalizedContent = content.startsWith('\n') ? content : '\n' + content;

  return `---\n${yamlStr}---${normalizedContent}`;
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
