export interface DropboxItem {
  name: string;
  isFolder: boolean;
  type?: string;
  category?: string;
  description?: string;
  size?: string;
}

export interface DropboxInfoResponse {
  success: boolean;
  url: string;
  zipDownloadUrl: string;
  folderTitle: string;
  description?: string;
  detectedItems?: DropboxItem[];
  hasDetectedItems?: boolean;
  error?: string;
}

export type ViewMode = 'embedded' | 'grid' | 'categories';

export interface VideoLesson {
  id: string;
  number: number;
  title: string;
  module: string;
  url: string;
  description?: string;
  duration?: string;
  thumbnail?: string;
  uploadDate?: string;
}
