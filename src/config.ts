import * as vscode from 'vscode';

export interface Config {
  enable: boolean;
  updateOnSave: boolean;
  fileTypes: string[];
  updatedTimeKey: string;
  createdTimeKey: string;
  slugKey: string;
  timeFormat: string;
  updateUpdatedTime: boolean;
  updateCreatedTime: boolean;
  updateSlug: boolean;
}

export function getConfig(): Config {
  const config = vscode.workspace.getConfiguration('markdownFrontmatter');

  return {
    enable: config.get<boolean>('enable', true),
    updateOnSave: config.get<boolean>('updateOnSave', true),
    fileTypes: config.get<string[]>('fileTypes', ['md', 'mdx']),
    updatedTimeKey: config.get<string>('updatedTimeKey', 'updatedTime'),
    createdTimeKey: config.get<string>('createdTimeKey', 'createdTime'),
    slugKey: config.get<string>('slugKey', 'slug'),
    timeFormat: config.get<string>('timeFormat', 'YYYY-MM-DD HH:mm:ss'),
    updateUpdatedTime: config.get<boolean>('updateUpdatedTime', true),
    updateCreatedTime: config.get<boolean>('updateCreatedTime', true),
    updateSlug: config.get<boolean>('updateSlug', true),
  };
}

export function isFileTypeSupported(fileName: string, fileTypes: string[]): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ext ? fileTypes.includes(ext) : false;
}
