/**
 * @fileOverview Environment variables validation utility for DRAPE AI.
 * Logs a status table to the console in development mode.
 */

export function checkEnvVariables() {
  // Only run in development mode
  if (process.env.NODE_ENV !== 'development') return;

  const vars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_GROQ_API_KEY',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];

  console.log('%c DRAPE AI - Environment Check', 'color: #C9A84C; font-weight: bold; font-size: 14px;');
  
  // Note: Using process.env as a fallback for Next.js environments 
  // while checking for the requested VITE_ keys
  const results = vars.map(name => ({
    'Variable Name': name,
    'Status': (process.env[name] || (globalThis as any).import?.meta?.env?.[name]) ? '✅ Loaded' : '❌ Missing'
  }));

  console.table(results);
}
