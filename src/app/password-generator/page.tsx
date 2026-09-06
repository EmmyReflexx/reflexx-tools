'use client'
import { generatePassword } from "@/utils/generatePassword"
import { useState, useEffect, useCallback } from "react"
import { PageHeading } from "@/components/PageHeading";
import { HiOutlineClipboard, HiOutlineCheck, HiOutlineRefresh } from "react-icons/hi";

type PasswordOptions = {
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

const STRENGTH_MAP = {
  1: { label: 'Very Weak', bars: 1, color: 'text-red-500', barColors: ['bg-red-500', 'bg-zinc-200', 'bg-zinc-200', 'bg-zinc-200'] },
  2: { label: 'Weak', bars: 2, color: 'text-red-500', barColors: ['bg-red-500', 'bg-red-500', 'bg-zinc-200', 'bg-zinc-200'] },
  3: { label: 'Fair', bars: 2, color: 'text-yellow-500', barColors: ['bg-yellow-500', 'bg-yellow-500', 'bg-zinc-200', 'bg-zinc-200'] },
  4: { label: 'Good', bars: 3, color: 'text-yellow-500', barColors: ['bg-yellow-500', 'bg-yellow-500', 'bg-yellow-500', 'bg-zinc-200'] },
  5: { label: 'Strong', bars: 4, color: 'text-green-500', barColors: ['bg-green-500', 'bg-green-500', 'bg-green-500', 'bg-green-500'] },
  6: { label: 'Very Strong', bars: 4, color: 'text-green-500', barColors: ['bg-green-500', 'bg-green-500', 'bg-green-500', 'bg-green-500'] }
};

const DEFAULT_STRENGTH = STRENGTH_MAP[1];

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(16);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<PasswordOptions>({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });
  const [strength, setStrength] = useState(DEFAULT_STRENGTH);

  const calculateStrength = (pwd: string) => {
    if (!pwd) return DEFAULT_STRENGTH;

    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;
    if (pwd.length >= 12 && /[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1;
    if (pwd.length >= 14 && /[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd)) score += 1;

    const level = score >= 8 ? 6 : score >= 6 ? 5 : score >= 5 ? 4 : score >= 3 ? 3 : score >= 2 ? 2 : 1;
    return STRENGTH_MAP[level as keyof typeof STRENGTH_MAP];
  };

  const generateNewPassword = useCallback(() => {
    try {
      setPassword(generatePassword(passwordLength, options));
    } catch {
      setPassword('');
    }
  }, [passwordLength, options]);

  useEffect(() => {
    generateNewPassword();
  }, [generateNewPassword]);

  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password]);

  const handleCopyPassword = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy password:', error);
    }
  };

  const handleOptionChange = (key: keyof PasswordOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sliderProgress = ((passwordLength - 4) / (64 - 4)) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      <PageHeading id="password-generator" />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Password Display */}
        <div className="p-4 sm:p-6 rounded-2xl border-2 border-brand-border bg-white shadow-xs sm:shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-zinc-50 rounded-xl px-4 py-3 border-2 border-brand-border font-lexend-b text-base sm:text-lg text-brand-dark break-all min-h-[52px] flex items-center">
              {password || <span className="text-brand-muted font-lexend-r text-sm">Generating password...</span>}
            </div>
            <button
              onClick={handleCopyPassword}
              disabled={!password}
              className={`p-3 rounded-xl border-2 transition-all shrink-0 ${copied ? 'border-green-400 bg-green-50 text-green-600' : 'border-brand-border hover:border-neon bg-white hover:bg-zinc-50'} ${!password ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {copied ? <HiOutlineCheck className="w-5 h-5" /> : <HiOutlineClipboard className="w-5 h-5" />}
            </button>
            <button
              onClick={generateNewPassword}
              className="p-3 rounded-xl border-2 border-neon bg-neon hover:bg-neon/90 transition-all cursor-pointer shrink-0"
            >
              <HiOutlineRefresh className="w-5 h-5 text-brand-dark" />
            </button>
          </div>

          {password && (
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`font-lexend-b text-xs ${strength.color}`}>{strength.label}</span>
                <span className="font-lexend-r text-xs text-brand-muted">{password.length} characters</span>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${strength.barColors[i]}`} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 sm:p-6 rounded-2xl border-2 border-brand-border bg-white shadow-xs sm:shadow-sm space-y-6">
          {/* Length Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-lexend-b text-sm text-brand-dark">Password Length</label>
              <span className="font-lexend-eb text-lg text-brand-dark bg-zinc-100 px-3 py-1 rounded-lg min-w-[48px] text-center">
                {passwordLength}
              </span>
            </div>

            {/* Range Slider with Background Progress */}
            <div className="relative">
              {/* Background track */}
              <div className="w-full h-2 rounded-full bg-zinc-200" />

              {/* Progress fill */}
              <div
                className="absolute top-0 left-0 h-2 rounded-full bg-neon pointer-events-none transition-all duration-150"
                style={{ width: `${sliderProgress}%` }}
              />

              {/* Actual range input - transparent background so progress shows through */}
              <input
                type="range"
                min="4"
                max="64"
                value={passwordLength}
                onChange={(e) => setPasswordLength(Number(e.target.value))}
                className="absolute top-0 left-0 w-full h-2 rounded-full appearance-none cursor-pointer bg-transparent
                  [&::-webkit-slider-thumb]:appearance-none 
                  [&::-webkit-slider-thumb]:w-5 
                  [&::-webkit-slider-thumb]:h-5 
                  [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-neon 
                  [&::-webkit-slider-thumb]:border-2 
                  [&::-webkit-slider-thumb]:border-brand-dark 
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:relative
                  [&::-webkit-slider-thumb]:z-10
                  [&::-moz-range-thumb]:w-5 
                  [&::-moz-range-thumb]:h-5 
                  [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-neon 
                  [&::-moz-range-thumb]:border-2 
                  [&::-moz-range-thumb]:border-brand-dark
                  [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:hover:scale-110
                  [&::-moz-range-thumb]:relative
                  [&::-moz-range-thumb]:z-10
                  [&::-moz-range-track]:h-2
                  [&::-moz-range-track]:rounded-full
                  [&::-moz-range-track]:bg-transparent"
              />
            </div>

            <div className="flex justify-between text-xs text-brand-muted font-lexend-r">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          {/* Character Options */}
          <div className="space-y-3">
            <label className="font-lexend-b text-sm text-brand-dark block">Include Characters</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { key: 'lowercase', label: 'abc' },
                { key: 'uppercase', label: 'ABC' },
                { key: 'numbers', label: '123' },
                { key: 'symbols', label: '#&' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-brand-border hover:border-neon cursor-pointer transition-all bg-white">
                  <input
                    type="checkbox"
                    checked={options[key as keyof PasswordOptions]}
                    onChange={() => handleOptionChange(key as keyof PasswordOptions)}
                    className="w-4 h-4 accent-neon cursor-pointer"
                  />
                  <span className="font-lexend-r text-sm text-brand-dark">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={generateNewPassword}
            className="w-full py-3.5 px-4 rounded-xl bg-neon text-brand-dark font-lexend-b text-sm border-2 border-neon hover:bg-neon/90 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
          >
            Generate New Password
          </button>
        </div>

        {/* Info Footer */}
        {password && (
          <div className="p-4 rounded-xl border-2 border-brand-border bg-white shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-lexend-r text-xs text-brand-muted">Characters used:</span>
                <span className="font-lexend-b text-xs text-brand-dark">
                  {options.lowercase && 'a-z '}
                  {options.uppercase && 'A-Z '}
                  {options.numbers && '0-9 '}
                  {options.symbols && '!@#$ '}
                </span>
              </div>
              <span className="font-lexend-r text-xs text-brand-muted">Length: {passwordLength}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}