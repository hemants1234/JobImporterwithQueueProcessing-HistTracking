const cron = require('node-cron');
const fetchAndSaveJobs = require('../utils/fetchJobs.js');// ../utils/fetchJobs

cron.schedule('0 * * * *', async () => {
  console.log(`[CRON] Running job fetch at ${new Date().toISOString()}`);
  await fetchAndSaveJobs();
});
