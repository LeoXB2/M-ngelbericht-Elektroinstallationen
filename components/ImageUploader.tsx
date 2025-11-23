import React from 'react';

interface ImageUploaderProps {
  onDescriptionChange: (text: string) => void;
  description: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onDescriptionChange, description }) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">1. Installation beschreiben</h2>
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Beschreiben Sie die Elektroinstallation hier. Nennen Sie Details wie verwendete Komponenten, Verlegeart, Umgebung etc."
        className="w-full flex-grow bg-gray-50 rounded-lg p-4 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-[#88bd24] focus:border-[#88bd24] transition-colors"
        rows={10}
        aria-label="Beschreibung der Elektroinstallation"
      />
    </div>
  );
};