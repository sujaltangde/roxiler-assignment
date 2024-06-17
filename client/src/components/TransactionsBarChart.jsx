import React from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale);

export const TransactionsBarChart = ({ barChartData, selectedMonth }) => {
  let priceValuesArray = [];

  if (barChartData.success) {
    priceValuesArray = Object.values(barChartData.priceRanges);
  }

  const data = {
    labels: [
      "0 - 100",
      "101 - 200",
      "201 - 300",
      "301 - 400",
      "401 - 500",
      "501 - 600",
      "601 - 700",
      "701 - 800",
      "801 - 900",
      "901 - above",
    ],
    datasets: [
      {
        label: "Sales",
        data: priceValuesArray.length !== 0 ? priceValuesArray : [],
        backgroundColor: "#00ffdd",
      },
    ],
  };

  return (
    <>
      <div className="px-14 py-3 flex justify-start items-start">
        <div className="w-3/6">
          <h2 className="text-3xl font-bold py-3">
            Bar Chart Stats - {selectedMonth}
          </h2>
          <Bar
            data={data}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
};
