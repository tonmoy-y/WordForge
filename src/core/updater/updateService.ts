export interface ReleaseInfo {
  version: string;
  tagName: string;
  releaseDate: string;
  releaseNotes: string;
  htmlUrl: string;
  dmgDownloadUrl?: string;
  zipDownloadUrl?: string;
  isNewer: boolean;
}

export const CURRENT_VERSION = '1.1.0';
const REPO_OWNER = 'tonmoy-y';
const REPO_NAME = 'WordForge';

export class UpdateService {
  public static async checkForUpdates(): Promise<ReleaseInfo> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const data = await response.json();
      const tagName = data.tag_name || 'v1.1.0';
      const cleanVersion = tagName.replace(/^v/, '');

      const dmgAsset = data.assets?.find((a: any) => a.name.endsWith('.dmg'));
      const zipAsset = data.assets?.find((a: any) => a.name.endsWith('.zip'));

      const isNewer = this.compareVersions(cleanVersion, CURRENT_VERSION) > 0;

      return {
        version: cleanVersion,
        tagName,
        releaseDate: new Date(data.published_at || data.created_at).toLocaleDateString(),
        releaseNotes: data.body || 'Performance enhancements, Word for Mac high-fidelity UI, and stability updates.',
        htmlUrl: data.html_url,
        dmgDownloadUrl: dmgAsset?.browser_download_url,
        zipDownloadUrl: zipAsset?.browser_download_url,
        isNewer,
      };
    } catch (err: any) {
      console.warn('Update check failed:', err);
      return {
        version: CURRENT_VERSION,
        tagName: `v${CURRENT_VERSION}`,
        releaseDate: new Date().toLocaleDateString(),
        releaseNotes: `You are running WordForge v${CURRENT_VERSION}.`,
        htmlUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases`,
        isNewer: false,
      };
    }
  }

  public static downloadUpdate(url: string, filename: string = 'WordForge-Update.dmg'): void {
    const api = (window as any).electronAPI;
    if (api && api.openExternal) {
      api.openExternal(url);
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private static compareVersions(v1: string, v2: string): number {
    const p1 = v1.split('.').map((n) => parseInt(n, 10) || 0);
    const p2 = v2.split('.').map((n) => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
      const num1 = p1[i] || 0;
      const num2 = p2[i] || 0;
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    return 0;
  }
}
