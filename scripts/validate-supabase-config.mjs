const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key || key === 'placeholder' || key === 'placeholder_key') {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

if (!/^https:\/\/[^/]+\.supabase\.co$/.test(url)) {
  throw new Error('Invalid NEXT_PUBLIC_SUPABASE_URL format.');
}

const response = await fetch(`${url}/auth/v1/settings`, {
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
  },
});

if (!response.ok) {
  let message = `Supabase key validation failed with HTTP ${response.status}.`;
  try {
    const data = await response.json();
    message = data?.message || data?.error || message;
  } catch {
    // Keep generic message. Never print the API key.
  }
  throw new Error(message);
}

console.log('Supabase public auth key validated successfully.');
