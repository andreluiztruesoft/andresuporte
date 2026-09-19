import JSZip from 'jszip';
import { VideoLesson } from '../types';

/**
 * Downloads a single Windows Desktop Internet Shortcut (.url)
 * When double-clicked on Windows, opens the default browser directly to the URL.
 */
export function downloadShortcut(title: string, url: string, prefixNumber?: number) {
  const safeTitle = title.replace(/[\\/:*?"<>|]/g, '-').trim();
  const numPrefix = prefixNumber !== undefined ? `${String(prefixNumber).padStart(2, '0')} - ` : '';
  const filename = `${numPrefix}${safeTitle}.url`;
  
  const content = `[InternetShortcut]\r\nURL=${url}\r\nIconIndex=0\r\n`;
  const blob = new Blob([content], { type: 'application/internet-shortcut;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Generates and downloads a ZIP file containing all video lesson shortcuts (.url)
 * Ready to be extracted into a folder on the client's desktop.
 */
export async function downloadAllShortcutsAsZip(
  lessons: VideoLesson[],
  folderName = 'Atalhos - Video Aulas Power Gestor'
) {
  const zip = new JSZip();
  const folder = zip.folder(folderName) || zip;

  // General channel shortcut
  const generalContent = `[InternetShortcut]\r\nURL=https://vimeo.com/powergestor\r\nIconIndex=0\r\n`;
  folder.file(`00 - Canal Completo de Video Aulas Power Gestor.url`, generalContent);

  // All individual lesson shortcuts
  lessons.forEach((lesson, index) => {
    const num = String(lesson.number || index + 1).padStart(2, '0');
    const safeTitle = lesson.title.replace(/[\\/:*?"<>|]/g, '-').trim();
    const filename = `${num} - ${safeTitle}.url`;
    const content = `[InternetShortcut]\r\nURL=${lesson.url}\r\nIconIndex=0\r\n`;
    folder.file(filename, content);
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(zipBlob);
  link.download = `${folderName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
