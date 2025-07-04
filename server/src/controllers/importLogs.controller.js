const ImportLog = require('../models/importLog.model.js'); // Make sure the path is correct

const getLogsHistory = async (req, res) => {
  const logs = await ImportLog.find().sort({ timestamp: -1 });
  res.json(logs);
};

module.exports = getLogsHistory;