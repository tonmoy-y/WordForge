import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import { DocumentMetadata } from '../../types/document';

interface DocumentPropertiesDialogProps {
  metadata: DocumentMetadata;
  onSave: (updates: Partial<DocumentMetadata>) => void;
  onClose: () => void;
}

export const DocumentPropertiesDialog: React.FC<DocumentPropertiesDialogProps> = ({
  metadata,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(metadata.title);
  const [subject, setSubject] = useState(metadata.subject);
  const [author, setAuthor] = useState(metadata.author);
  const [company, setCompany] = useState(metadata.company);
  const [keywords, setKeywords] = useState(metadata.keywords);
  const [comments, setComments] = useState(metadata.comments);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      subject,
      author,
      company,
      keywords,
      comments,
      modified: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="word-dialog-overlay" onClick={onClose}>
      <div className="word-dialog-box w-[460px]" onClick={(e) => e.stopPropagation()}>
        <div className="word-dialog-header">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-[#185ABD]" />
            <span>Document Properties</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="word-dialog-content flex flex-col gap-3 text-xs">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Subject:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Author:</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Company:</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Keywords:</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Comments:</label>
              <textarea
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 border-t border-gray-200 text-gray-500 flex justify-between text-[11px]">
              <span>Created: {new Date(metadata.created).toLocaleDateString()}</span>
              <span>Modified: {new Date(metadata.modified).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="word-dialog-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
