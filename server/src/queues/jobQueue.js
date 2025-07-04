const Bull = require('bull');
const jobQueue = new Bull('job-processing', {
    redis: {
        host: '127.0.0.1',
        port: 6379,
    },
});

module.exports = jobQueue;
