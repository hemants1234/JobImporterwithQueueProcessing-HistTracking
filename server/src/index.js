const http = require('http');
const { Server } = require('socket.io');
//const PORT = 3002;
const initializeWorker = require('./workers/jobWorker.js');
const fetchAndSaveJobs = require('./utils/fetchJobs');
const dotenv = require("dotenv");
const connectDb = require('./db/index.js');
const {app} = require('./app.js');
dotenv.config({
    path: './.env'
})


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

initializeWorker(io);


(async () => {
  try {
    await fetchAndSaveJobs();
    console.log('Jobs fetched and saved');
  } catch (err) {
    console.error('Error fetching jobs:', err);
  }
})();

const PORT = process.env.PORT || 3005;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
      await connectDb();
      console.log('✅ DB connected');  
    } catch (error) {
      console.error('❌ DB connection error:', error.message);
    }
});


  
