# Architecture Overview

## Key Components

### 1. Data Fetching
- Scheduled hourly job
- Fetches from multiple RSS XML feeds
- Converts to JSON
- Adds to Redis job queue

### 2. Queue Processing
- BullMQ worker
- Inserts/Updates jobs in MongoDB
- Records status (new, updated, failed)

### 3. History Logging
- Import logs stored in `import_logs` collection
- Tracks job stats per fetch run

## Scalability
- Jobs processed asynchronously
- Workers can be horizontally scaled
- Feed list is extensible

## Technologies
- Backend: Express.js
- Frontend: Next.js
- Queue: BullMQ
- DB: MongoDB
- Queue store: Redis

## Diagram

[Insert architecture diagram here via draw.io]

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
             |                                       |
             +----------------+----------------------+
                                  |
                                  v
                +----------------+----------------+
                |     MongoDB (2 collections)     |
                |  - job.model                    |
                |  - importLog.model              |
                +----------------+----------------+
                                  |
                                  v
                 +-------------------------------+
                 |   Next.js  Dashboard          |
                 |  - View Import History        |
                 |  - Table of logs(success/fail)|
                 +-------------------------------+



