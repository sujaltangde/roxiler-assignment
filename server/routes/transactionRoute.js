const { initializeTransaction, transactions, statistics, barChartData, pieChartData, analytics } = require("../controllers/transactionControls");

const express = require("express");

const router = express.Router();

router.route("/initialize_table").get(initializeTransaction);

router.route('/transactions').get(transactions);

router.route('/statistics/:month').get(statistics);

router.route('/barChartData/:month').get(barChartData);

router.route('/pieChartData/:month').get(pieChartData);

router.route('/analytics/:month').get(analytics);


module.exports = router;


