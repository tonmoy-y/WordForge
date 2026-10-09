import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { AppPreferences, DEFAULT_PREFERENCES } from '../../core/persistence/storage';
import { PAGE_SIZES, PageSize } from '../../types/document';
import { DOCUMENT_THEMES } from '../../core/themes/documentThemes';

interface PreferencesDialogProps {
  preferences: AppPreferences;
  onSave: (prefs: AppPreferences) => void;
  onClose: () => void;
}

export const PreferencesDialog: React.FC<PreferencesDialogProps> = ({
  preferences,
  onSave,
  onClose,
}) => {
  const [prefs, setPrefs] = useState<AppPreferences>({ ...preferences });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(prefs);
    onClose();
  };

  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-[440px]" onClick={(e) => e.stopPropagation()}>
        <div className="word-dialog-header">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-[#185ABD]" />
            <span>Preferences</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="word-dialog-content flex flex-col gap-3 text-xs">
            <div className="font-semibold text-gray-800 border-b border-gray-200 pb-1">
              General & Typography
            </div>

            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Default Font:</label>
              <select
                value={prefs.defaultFont}
                onChange={(e) => setPrefs({ ...prefs, defaultFont: e.target.value })}
                className="w-40 border border-gray-300 rounded px-2 py-1 bg-white"
              >
                {['Aptos', 'Calibri', 'Arial', 'Georgia', 'Times New Roman', 'Fira Code', 'Playfair Display', 'Inter'].map(
                  (f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Default Font Size:</label>
              <input
                type="number"
                min="8"
                max="72"
                value={prefs.defaultFontSize}
                onChange={(e) =>
                  setPrefs({ ...prefs, defaultFontSize: parseInt(e.target.value, 10) || 11 })
                }
                className="w-20 border border-gray-300 rounded px-2 py-1 text-right"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Default Paper Size:</label>
              <select
                value={prefs.defaultPaperSize}
                onChange={(e) => setPrefs({ ...prefs, defaultPaperSize: e.target.value })}
                className="w-40 border border-gray-300 rounded px-2 py-1 bg-white"
              >
                {(Object.keys(PAGE_SIZES) as PageSize[]).map((sz) => (
                  <option key={sz} value={sz}>
                    {PAGE_SIZES[sz].name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Default Theme:</label>
              <select
                value={prefs.defaultTheme}
                onChange={(e) => setPrefs({ ...prefs, defaultTheme: e.target.value })}
                className="w-40 border border-gray-300 rounded px-2 py-1 bg-white"
              >
                {Object.values(DOCUMENT_THEMES).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="font-semibold text-gray-800 border-b border-gray-200 pb-1 mt-2">
              AutoSave & Persistence
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={prefs.autoSaveEnabled}
                onChange={(e) => setPrefs({ ...prefs, autoSaveEnabled: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Enable background AutoSave drafts</span>
            </label>

            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">AutoSave Interval (Seconds):</label>
              <input
                type="number"
                min="5"
                max="300"
                value={prefs.autoSaveIntervalSeconds}
                onChange={(e) =>
                  setPrefs({
                    ...prefs,
                    autoSaveIntervalSeconds: parseInt(e.target.value, 10) || 15,
                  })
                }
                className="w-20 border border-gray-300 rounded px-2 py-1 text-right"
              />
            </div>
          </div>

          <div className="word-dialog-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
