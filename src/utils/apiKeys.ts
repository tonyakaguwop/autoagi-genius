const GEMINI_API_KEY_STORAGE_KEY = 'gemini_api_key';

export const getGeminiApiKey = (): string | null => {
  return localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
};

export const setGeminiApiKey = (apiKey: string): void => {
  localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, apiKey);
  console.log('Gemini API key saved');
};

export const removeGeminiApiKey = (): void => {
  localStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
  console.log('Gemini API key removed');
};