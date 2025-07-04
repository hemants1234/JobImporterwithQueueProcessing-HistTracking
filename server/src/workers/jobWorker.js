// jobWorker.js
const jobQueue = require('../queues/jobQueue.js');
const Job = require('../models/job.model.js'); //models/Job
const ImportLog = require('../models/importLog.model.js');

const batchStats = new Map();
let io = null; // <-- placeholder

function initializeWorker(socketInstance) {
  io = socketInstance; // <-- set from main server

  jobQueue.process(5, async (job) => {
    const { jobData, batchId, feedUrl } = job.data;

    if (!batchStats.has(batchId)) {
      batchStats.set(batchId, {
        feedUrl,
        timestamp: new Date(),
        totalFetched: 0,
        newJobs: 0,
        updatedJobs: 0,
        failedJobs: [],
      });
    }

    const stats = batchStats.get(batchId);
    stats.totalFetched++;

    try {
      const existing = await Job.findOne({ guid: jobData.guid });

      if (existing) {
        await Job.updateOne({ guid: jobData.guid }, jobData);
        stats.updatedJobs++;
        console.log(`🔄 Updated: ${jobData.guid}`);
      } else {
        await new Job(jobData).save();
        stats.newJobs++;
        console.log(`✅ New: ${jobData.guid}`);
      }
    } catch (err) {
      stats.failedJobs.push({
        guid: jobData.guid,
        error: err.message,
      });
      console.error(`❌ Failed: ${jobData.guid} - ${err.message}`);
    }
  });

  jobQueue.on('drained', async () => {
    console.log('📦 Queue drained. Saving import logs...');
    for (const [batchId, stats] of batchStats.entries()) {
      const saved = await new ImportLog({
        fileName: stats.feedUrl,
        timestamp: stats.timestamp,
        totalFetched: stats.totalFetched,
        newJobs: stats.newJobs,
        updatedJobs: stats.updatedJobs,
        failedJobs: stats.failedJobs,
      }).save();

      // 🚀 Emit real-time event via Socket.IO
      if (io) {
        io.emit('newImportLog', saved);
        console.log(`📡 Emitted import log for batch ${batchId}`);
      }

      batchStats.delete(batchId);
    }
  });
}

module.exports = initializeWorker;
