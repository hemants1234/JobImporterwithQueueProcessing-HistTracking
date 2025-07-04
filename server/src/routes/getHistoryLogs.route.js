const Router = require('express');
const getLogsHistory = require ('../controllers/importLogs.controller.js');

const router = Router()

//router.use();

router.route("/import-logs").get(getLogsHistory); 

module.exports = router;

