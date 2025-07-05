export async function fetchImportLogs() {
  const res = await fetch('http://localhost:3005/api/v1/jobsHistory/import-logs'); // Replace with your real backend URL
  if (!res.ok) throw new Error('Failed to fetch import logs');
  return await res.json();
}
