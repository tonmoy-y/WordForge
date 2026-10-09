import { DocumentState } from '../../types/document';

const STORAGE_KEYS = {
  RECENT_DOCS: 'wordforge_recent_documents',
  AUTOSAVE_DRAFT: 'wordforge_autosave_draft',
  PREFERENCES: 'wordforge_user_preferences',
};

export interface RecentDocItem {
  id: string;
  title: string;
  filePath: string | null;
  lastOpened: string;
}

export interface AppPreferences {
  defaultFont: string;
  defaultFontSize: number;
  defaultPaperSize: string;
  defaultTheme: string;
  autoSaveEnabled: boolean;
  autoSaveIntervalSeconds: number;
  showRulerByDefault: boolean;
  language: string;
}

export const DEFAULT_PREFERENCES: AppPreferences = {
  defaultFont: 'Aptos',
  defaultFontSize: 11,
  defaultPaperSize: 'letter',
  defaultTheme: 'office',
  autoSaveEnabled: true,
  autoSaveIntervalSeconds: 15,
  showRulerByDefault: true,
  language: 'English (US)',
};

export class StorageService {
  public static saveRecentDocument(doc: { id: string; title: string; filePath: string | null }): void {
    try {
      const recents = this.getRecentDocuments();
      const updated = [
        { ...doc, lastOpened: new Date().toISOString() },
        ...recents.filter((r) => r.id !== doc.id && (!doc.filePath || r.filePath !== doc.filePath)),
      ].slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.RECENT_DOCS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update recent documents:', e);
    }
  }

  public static getRecentDocuments(): RecentDocItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENT_DOCS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  public static saveDraft(state: DocumentState): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.AUTOSAVE_DRAFT,
        JSON.stringify({
          savedAt: new Date().toISOString(),
          state: {
            ...state,
            isDirty: true,
          },
        })
      );
    } catch (e) {
      console.warn('Failed to auto-save draft:', e);
    }
  }

  public static getDraft(): { savedAt: string; state: DocumentState } | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTOSAVE_DRAFT);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  public static clearDraft(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTOSAVE_DRAFT);
    } catch (e) {
      console.warn('Failed to clear draft:', e);
    }
  }

  public static getPreferences(): AppPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? { ...DEFAULT_PREFERENCES, ...JSON.parse(data) } : DEFAULT_PREFERENCES;
    } catch (e) {
      return DEFAULT_PREFERENCES;
    }
  }

  public static savePreferences(prefs: AppPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Failed to save preferences:', e);
    }
  }
}
