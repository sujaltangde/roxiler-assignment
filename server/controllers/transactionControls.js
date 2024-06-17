const Transaction = require("../models/transactionModel");
const axios = require("axios");

exports.initializeTransaction = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    const transactions = response.data.map((transaction) => {
      const date = new Date(transaction.dateOfSale);
      const monthOfSale = parseInt(date.getMonth() + 1);

      return {
        ...transaction,
        monthOfSale,
      };
    });

    await Transaction.insertMany(transactions);

    res.status(200).json({
      success: true,
      message: "Transactions added",
      transactions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.transactions = async (req, res) => {
  try {
    const { page, perPage, search, month } = req.query;
    const targetMonth = parseInt(month);
    const query = {};

    if (search) {
      const isNumeric = !isNaN(search);
      if (isNumeric) {
        query.price = parseFloat(search);
      } else {
        const searchRegex = new RegExp(search, "i");
        query.$or = [{ title: searchRegex }, { description: searchRegex }];
      }
    }

    if (!isNaN(targetMonth)) {
      query.monthOfSale = targetMonth;
    }

    const totalCount = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      success: true,
      total: totalCount,
      page,
      perPage,
      transactions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.statistics = async (req, res) => {
  try {
    const { month } = req.params;

    const targetMonth = parseInt(month);

    const transactions = await Transaction.find();

    const data = transactions.filter((item) => {
      const date = new Date(item.dateOfSale);

      const saleMonth = date.getMonth() + 1;

      return saleMonth === targetMonth;
    });

    let totalSoldItems = 0;
    let totalNotSoldItems = 0;
    let totalSaleAmount = 0;

    data.forEach((item) => {
      if (item.sold) {
        totalSoldItems++;
        totalSaleAmount += item.price;
      } else {
        totalNotSoldItems++;
      }
    });

    res.status(200).json({
      success: true,
      totalSaleAmount: parseFloat(totalSaleAmount.toFixed(2)),
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.barChartData = async (req, res) => {
  try {
    const { month } = req.params;

    const targetMonth = parseInt(month);

    const transactions = await Transaction.find();

    const data = transactions.filter((item) => {
      const date = new Date(item.dateOfSale);

      const saleMonth = date.getMonth() + 1;

      return saleMonth === targetMonth;
    });

    const priceRanges = {
      "0 - 100": 0,
      "101 - 200": 0,
      "201 - 300": 0,
      "301 - 400": 0,
      "401 - 500": 0,
      "501 - 600": 0,
      "601 - 700": 0,
      "701 - 800": 0,
      "801 - 900": 0,
      "901 - above": 0,
    };

    data.forEach((item) => {
      const price = item.price;
      if (price <= 100) {
        priceRanges["0 - 100"]++;
      } else if (price <= 200) {
        priceRanges["101 - 200"]++;
      } else if (price <= 300) {
        priceRanges["201 - 300"]++;
      } else if (price <= 400) {
        priceRanges["301 - 400"]++;
      } else if (price <= 500) {
        priceRanges["401 - 500"]++;
      } else if (price <= 600) {
        priceRanges["501 - 600"]++;
      } else if (price <= 700) {
        priceRanges["601 - 700"]++;
      } else if (price <= 800) {
        priceRanges["701 - 800"]++;
      } else if (price <= 900) {
        priceRanges["801 - 900"]++;
      } else {
        priceRanges["901 - above"]++;
      }
    });

    res.status(200).json({
      success: true,
      priceRanges,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.pieChartData = async (req, res) => {
  try {
    const { month } = req.params;

    const targetMonth = parseInt(month);

    const transactions = await Transaction.find();

    const data = transactions.filter((item) => {
      const date = new Date(item.dateOfSale);

      const saleMonth = date.getMonth() + 1;

      return saleMonth === targetMonth;
    });

    const categoryCounts = {};

    data.forEach((item) => {
      const category = item.category;
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
    });

    res.status(200).json({
      success: true,
      categoryCounts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.analytics = async (req, res) => {
  try {
    const { month } = req.params;

    const statisticsResponse = await axios.get(
      "http://localhost:5000/api/v1/statistics/" + month
    );

    const barChartDataResponse = await axios.get(
      "http://localhost:5000/api/v1/barChartData/" + month
    );

    const pieChartDataResponse = await axios.get(
      "http://localhost:5000/api/v1/pieChartData/" + month
    );

    const combinedData = {
      statistics: statisticsResponse.data,
      barChartData: barChartDataResponse.data,
      pieChartData: pieChartDataResponse.data,
    };

    res.status(200).json({
      success: true,
      combinedData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
