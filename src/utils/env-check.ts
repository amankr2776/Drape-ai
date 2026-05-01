/**
 * @fileOverview Environment variables validation utility for DRAPE AI.
 * Logs a status table to the console in development mode.
 */

export function checkEnvVariables() {
  // Only run in development mode
  if (process.env.NODE_ENV !== 'development') return;

  const vars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_GROQ_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  console.log('%c DRAPE AI - Environment Check', 'color: #C9A84C; font-weight: bold; font-size: 14px;');
  
  const results = vars.map(name => ({
    'Variable Name': name,
    'Status': process.env[name] ? '✅ Loaded' : '❌ Missing'
  }));

  console.table(results);
}
