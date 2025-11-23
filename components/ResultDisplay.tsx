import React from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

interface ResultDisplayProps {
  result: string;
  isLoading: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading }) => {
  const [isCopied, copy] = useCopyToClipboard();

  const handleCopy = () => {
    if (result) {
      copy(result);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <svg className="animate-spin h-8 w-8 text-[#88bd24] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="font-semibold text-gray-700">Analysiere Beschreibung...</p>
          <p className="text-sm">Dies kann einen Moment dauern.</p>
        </div>
      );
    }

    if (!result) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Das Analyseergebnis wird hier angezeigt.</p>
        </div>
      );
    }
    
    // Simple markdown-like formatting for bold text
    const formattedResult = result.split('**').map((part, index) => 
        index % 2 === 1 ? <strong key={index} className="font-semibold text-[#88bd24]">{part}</strong> : part
    );

    return (
         <div className="whitespace-pre-wrap prose prose-sm max-w-none text-gray-800">
            {formattedResult}
        </div>
    );
  };
  
  return (
    <div className="relative flex-grow flex flex-col bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
      {result && !isLoading && (
        <div className="absolute top-3 right-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
          >
            {isCopied ? 'Kopiert!' : 'Kopieren'}
          </button>
        </div>
      )}
      <div className="flex-grow">
          {renderContent()}
      </div>
    </div>
  );
};