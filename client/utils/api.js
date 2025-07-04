export async function fetchImportLogs() {
  const res = await fetch('http://localhost:3000/import-logs'); // Replace with your real backend URL
  if (!res.ok) throw new Error('Failed to fetch import logs');
  return await res.json();
}
