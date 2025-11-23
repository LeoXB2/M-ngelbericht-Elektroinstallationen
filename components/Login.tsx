import React, { useState } from 'react';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';

interface LoginProps {
  onLoginSuccess: () => void;
}

// IMPORTANT: This is a simple client-side gatekeeper.
// The password is in the code and easily discoverable.
// This is not suitable for protecting sensitive data, but sufficient
// for controlling access to a tool on a public URL.
// You can change the password here.
const CORRECT_PASSWORD = 'NIN-EN-2024@';

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError('');
      onLoginSuccess();
    } else {
      setError('Falsches Passwort. Bitte versuchen Sie es erneut.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#88bd24]">
            KI-Mängelbericht
            </h1>
            <p className="mt-2 text-gray-600">Bitte authentifizieren Sie sich, um fortzufahren.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Passwort
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 rounded-lg p-3 pr-10 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-[#88bd24] focus:border-[#88bd24] transition-colors"
                required
                autoFocus
                aria-describedby="password-error"
              />
               <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? 'Passwort ausblenden' : 'Passwort anzeigen'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p id="password-error" className="text-red-600 text-sm -mt-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out bg-[#88bd24] hover:bg-[#79a820] disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            Anmelden
          </button>
        </form>
          <footer className="w-full text-center mt-8 text-gray-500 text-sm">
            <p>©by Didier Arm</p>
        </footer>
      </div>
    </div>
  );
};
