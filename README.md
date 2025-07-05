✅ Project overview

⚙️ Setup instructions

🏃‍♂️ Running dev servers (frontend + backend)

🧪 Testing (if applicable)

🌐 Deployment tips

📁 Project structure

## 📘 Project Overview

**What it does:**  
This app automatically fetches job listings from external XML/RSS feeds (e.g., Jobicy), queues them for background processing, and stores them in MongoDB.

**Why it matters:**  
Manual import or one-time scripts don’t scale—especially with rotating feed content, duplicates, and failures to track. This system solves that with scheduled background jobs, deduplication, and detailed import logs.

**Key Features:**
- Hourly cron job fetching XML feeds
- Redis/BullMQ queue for scalable, concurrent processing
- Insert-or-update logic in MongoDB with unique GUID deduplication
- Import logs capturing counts of new, updated, and failed jobs
- Next.js dashboard to view import history and error details

**Tech Stack Overview:**
| Layer     | Tech Stack    |
|-----------|---------------|
| Scheduler | node-cron     |
| Queue     | Redis + BullMQ |
| API       | Node.js + Express |
| DB        | MongoDB + Mongoose |
| Frontend  | Next.js       |

**Usage Scenarios:**
- Automatically import updated job feeds with minimal manual intervention
- See at-a-glance statistics on import success/failures
- Review and debug feed errors quickly via the dashboard

**Scope:**  
This version focuses on core import functionality, basic dashboard. Future improvements may include authentication, real-time updates, job search.

## ⚙️ Setup Instructions

**🛠 Prerequisites**

Before running the project, ensure the following are installed on your system:-

- Node.js (v16+)
- npm or yarn
- MongoDB (locally or via Atlas)
- Redis (locally or via cloud service)

**🚀 Clone the Repository**

```bash
git clone https://github.com/yourusername/job-importer.git
cd job-importer
```

**Configure Environment Variables**
  ### server
  
 - MONGODB_URI='mongodb://127.0.0.1:27017/jobs'
 - CLIENT_URL='http://localhost:3000'
 - PORT=3005
