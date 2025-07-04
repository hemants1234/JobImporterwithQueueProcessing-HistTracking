const axios = require('axios');
const { parseXML } = require('./xmlParser');
const { deepSanitize } = require('./sanitize');
const jobQueue = require('../queues/jobQueue'); //queues/jobQueue
const { v4: uuidv4 } = require('uuid');

const FEED_URLS = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=business',
];

async function fetchAndSaveJobs() {
  let totalQueued = 0;
  let failedJobs = [];

  for (const url of FEED_URLS) {
    const batchId = uuidv4(); // Unique ID per feed per run

    try {
      const res = await axios.get(url);
      const parsed = await parseXML(res.data);
      const jobs = parsed?.rss?.channel?.[0]?.item || [];

      for (const job of jobs) {
        try {
          const rawPubDate = job.pubDate?.[0];
          const parsedPubDate =
            typeof rawPubDate === 'string' ? new Date(rawPubDate) : null;

          if (!parsedPubDate || isNaN(parsedPubDate.getTime())) {
            throw new Error(`Invalid pubDate: ${JSON.stringify(rawPubDate)}`);
          }

          const sanitizedJob = deepSanitize({
            guid: typeof job.guid?.[0] === 'string'
              ? job.guid[0]
              : job.guid?.[0]?._,
            title: job.title?.[0],
            link: job.link?.[0],
            description: job.description?.[0],
            pubDate: parsedPubDate,
            company: job['job_listing:company']?.[0] || null,
            location: job['job_listing:location']?.[0] || null,
            type: job['job_listing:job_type']?.[0] || null,
          });

          if (!sanitizedJob.guid) {
            throw new Error('Missing GUID');
          }

          // Add job to queue with batch info
          await jobQueue.add(
            {
              jobData: sanitizedJob,
              batchId,
              feedUrl: url,
            },
            {
              attempts: 3,
              backoff: 3000,
            }
          );

          totalQueued++;

        } catch (err) {
          console.error('❌ Failed to queue job:', err.message);
          failedJobs.push({
            title: job.title?.[0] || 'Unknown',
            guid: job.guid?.[0]?._ || job.guid?.[0] || 'No GUID',
            error: err.message,
          });
        }
      }
    } catch (error) {
      console.error(`❌ Error fetching from ${url}:`, error.message);
    }
  }

  // NOTE: import log is now handled by the worker based on batchId
  console.log(
    `[CRON] Fetched and queued jobs: ${totalQueued}, Failed: ${failedJobs.length}`
  );
}

module.exports = fetchAndSaveJobs;
