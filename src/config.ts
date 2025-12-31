import * as vscode from 'vscode';

export type FieldType = 'timestamp' | 'filename' | 'default';

export interface FieldConfig {
  type: FieldType;
  onlyIfMissing?: boolean;
  value?: unknown;
}

export interface FieldsConfig {
  [key: string]: FieldConfig;
}

export interface Config {
  enable: boolean;
  updateOnSave: boolean;
  fileTypes: string[];
  timeFormat: string;
  fields: FieldsConfig;
}

const DEFAULT_FIELDS: FieldsConfig = {
  updatedTime: { type: 'timestamp' },
  createdTime: { type: 'timestamp', onlyIfMissing: true },
  slug: { type: 'filename' },
};

export function getConfig(): Config {
  const config = vscode.workspace.getConfiguration('markdownFrontmatter');

  return {
    enable: config.get<boolean>('enable', true),
    updateOnSave: config.get<boolean>('updateOnSave', true),
    fileTypes: config.get<string[]>('fileTypes', ['md', 'mdx']),
    timeFormat: config.get<string>('timeFormat', 'YYYY-MM-DD HH:mm:ss'),
    fields: config.get<FieldsConfig>('fields', DEFAULT_FIELDS),
  };
}

export function isFileTypeSupported(fileName: string, fileTypes: string[]): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ext ? fileTypes.includes(ext) : false;
}
