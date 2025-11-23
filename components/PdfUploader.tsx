import React from 'react';
import { TrashIcon } from './icons/TrashIcon';
import { FileIcon } from './icons/FileIcon';

interface PdfUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  isParsing: boolean;
}

export const PdfUploader: React.FC<PdfUploaderProps> = ({ files, onFilesChange, isParsing }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const allFiles = [...files, ...newFiles];
      // Simple deduplication based on name and size
      const uniqueFiles = allFiles.filter((file, index, self) =>
        index === self.findIndex((f) => f.name === file.name && f.size === file.size)
      );
      onFilesChange(uniqueFiles);
      // Reset file input to allow re-uploading the same file after removal
      event.target.value = '';
    }
  };

  const removeFile = (fileToRemove: File) => {
    onFilesChange(files.filter(file => file !== fileToRemove));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold my-4 text-gray-700">2. Wissensbasis hinzufügen (Optional)</h2>
      <div className="flex flex-col gap-4">
        <label htmlFor="pdf-upload" className="relative cursor-pointer w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out bg-[#88bd24] hover:bg-[#79a820]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h18v-3.75" />
            </svg>
            <span>PDF-Dateien auswählen</span>
        </label>
        <input
          id="pdf-upload"
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isParsing}
        />
        {isParsing && (
            <div className="text-center text-gray-500">
                <p>Verarbeite PDFs...</p>
            </div>
        )}
        {files.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-gray-500">Hochgeladene Dokumente:</h3>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileIcon className="w-5 h-5 text-[#88bd24] flex-shrink-0" />
                    <span className="truncate text-sm text-gray-800" title={file.name}>
                      {file.name}
                    </span>
                  </div>
                  <button onClick={() => removeFile(file)} className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded-full" aria-label={`Remove ${file.name}`}>
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};