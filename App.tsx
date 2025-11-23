import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PdfUploader } from './components/PdfUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { analyzeInstallationDescription } from './services/geminiService';
import * as pdfjsLib from 'pdfjs-dist';
import { Login } from './components/Login';

// Set worker source for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.mjs`;

const AUTH_KEY = 'app_authenticated';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });
  const [description, setDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [pdfContext, setPdfContext] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLoginSuccess = () => {
    sessionStorage.setItem(AUTH_KEY, 'true');
    setIsAuthenticated(true);
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    setAnalysisResult('');
    setError('');
  };

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    setAnalysisResult('');
    setError('');
  };

  useEffect(() => {
    const parsePdfs = async () => {
      if (files.length === 0) {
        setPdfContext('');
        return;
      }

      setIsParsing(true);
      setError('');
      let combinedText = '';

      try {
        for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
          const numPages = pdf.numPages;
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
            combinedText += pageText + '\n\n';
          }
        }
        setPdfContext(combinedText);
      } catch (err) {
        console.error("Error parsing PDFs:", err);
        setError('Fehler beim Verarbeiten der PDF-Dateien. Bitte stellen Sie sicher, dass es sich um gültige PDF-Dokumente handelt.');
        setFiles([]); // Clear files on error
        setPdfContext('');
      } finally {
        setIsParsing(false);
      }
    };

    parsePdfs();
  }, [files]);

  const handleAnalysis = useCallback(async () => {
    if (!description) {
      setError('Bitte geben Sie zuerst eine Beschreibung ein.');
      return;
    }
    setIsAnalyzing(true);
    setError('');
    setAnalysisResult('');
    try {
      const result = await analyzeInstallationDescription(description, pdfContext);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('Fehler bei der Analyse der Beschreibung. Bitte versuchen Sie es erneut.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [description, pdfContext]);

  const isLoading = isAnalyzing || isParsing;
  
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl text-center mb-8">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#88bd24]">
            KI-Mängelbericht
          </h1>
        </div>
        <p className="mt-2 text-gray-600">
          Analysieren Sie eine Elektroinstallation mit optionalem Dokumenten-Kontext für präzisere Ergebnisse.
        </p>
      </header>
      
      <main className="w-full max-w-4xl flex-grow flex flex-col gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <ImageUploader
            onDescriptionChange={handleDescriptionChange}
            description={description}
          />
           <PdfUploader
            files={files}
            onFilesChange={handleFilesChange}
            isParsing={isParsing}
          />
          
          <h2 className="text-xl font-semibold my-4 text-gray-700">3. Analyse starten</h2>
            <button
                onClick={handleAnalysis}
                disabled={!description || isLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out bg-[#88bd24] hover:bg-[#79a820] disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isParsing ? 'Verarbeite PDFs...' : 'Analysiere...'}
                  </>
                ) : (
                  'Mängel analysieren'
                )}
            </button>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Analyseergebnis</h2>
          {error && (
            <div className="bg-red-100 text-red-800 border border-red-300 rounded-lg p-4 mb-4 flex items-center gap-3">
               <span role="img" aria-label="Warning" className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          <ResultDisplay result={analysisResult} isLoading={isAnalyzing} />
        </div>
      </main>

      <footer className="w-full max-w-4xl text-center mt-8 text-gray-500 text-sm">
        <p>©by Didier Arm</p>
      </footer>
    </div>
  );
};

export default App;