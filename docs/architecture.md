# 🏗️ Architecture Documentation

## 📌 Objective

Design and implement a scalable job importer system that:
- Fetches XML job feeds from external sources
- Queues the jobs using Redis and BullMQ
- Processes jobs asynchronously using worker threads
- Stores/imports the jobs into MongoDB
- Logs each import attempt (new, updated, failed)
- Displays import history via an admin dashboard

---

## 🧭 High-Level System Diagram

                   +------------------------+
                   |   Scheduled Cron Job   |
                   | (Every 1 Hour, Node)   |
                   +----------+-------------+
                              |
           +------------------v-------------------+
           |       Job Fetcher Service            |
           |  - Fetch XML from multiple APIs      |
           |  - Convert XML → JSON                |
           +----------------+---------------------+
                              |
                              v
                    +---------+---------+
                    |  Redis (BullMQ)   |
                    |  Queue: job-import|
                    +---------+---------+
                              |
                              v
         +---------------------------------------+
         |           Worker Processor            |
         |  - Insert/update job in MongoDB       |
         |  - Log job result (new/updated/failed)|
         |  - Collect import metrics             |
         +----------------+----------------------+
                              |
                              v
            +----------------+----------------+
            |     MongoDB (2 collections)     |
            |  - jobs                         |
            |  - import_logs                  |
            +----------------+----------------+
                              |
                              v
             +-------------------------------+
             |   Next.js Admin Dashboard     |
             |  - View Import History        |
             |  - Table of logs (success/fail)|
             +-------------------------------+



---

## 🧩 Component Breakdown

### 1. 🕒 Scheduled Cron Job
- Runs every hour using `node-cron`.
- Initiates job fetching from multiple RSS/XML APIs.
- Configurable via `.env`.

### 2. 🌐 Job Fetcher Service
- Fetches RSS feeds from multiple endpoints (Jobicy, HigherEdJobs, etc.).
- Converts XML → JSON using `xml2js`.
- Pushes each job into Redis queue for async processing.

### 3. 🚦 BullMQ + Redis Queue
- Jobs are added to `job-import` queue.
- Provides robust job retries, rate limiting, and concurrency control.

### 4. ⚙️ Worker Processor
- Consumes jobs from the Redis queue.
- Inserts or updates jobs in MongoDB (`jobs` collection).
- Tracks and categorizes results:
  - `newJobs`
  - `updatedJobs`
  - `failedJobs` (with error reason)
- Logs summary into `import_logs`.

### 5. 🛢️ MongoDB Collections
- **`jobs`**: Contains job data (title, company, description, etc.).
- **`import_logs`**: Each record tracks one import run:
 ### 🗂️ Sample `import_logs` Document

```json
{
  "_id": "68677972e841c07bdcc5b4cf",
  "fileName": "https://jobicy.com/?feed=job_feed",
  "timestamp": "2025-07-04T06:49:21.422Z",
  "totalFetched": 50,
  "totalImported": 0,
  "newJobs": 31,
  "updatedJobs": 0,
  "failedJobs": [
    {
      "_id": "68677972e841c07bdcc5b4d0",
      "guid": "https://jobicy.com/jobs/124564-content-writer-5",
      "error": "E11000 duplicate key error collection: jobs.jobs index: guid_1 dup key..."
    }
  ],
  "createdAt": "2025-07-04T06:49:22.210Z",
  "updatedAt": "2025-07-04T06:49:22.210Z",
  "__v": 0
}

