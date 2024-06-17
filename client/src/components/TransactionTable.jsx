import { useState } from "react";
import { useEffect } from "react";
import { TransactionStatistics } from "./TransactionStatistics";
import { TransactionsBarChart } from "./TransactionsBarChart";
import axios from "axios";

export const TransactionTable = () => {
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [statisticsData, setStatisticsData] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [success, setSuccess] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const analytics = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/v1/analytics/${
          months.indexOf(selectedMonth) + 1
        }`
      );

      if (res.data.success) {
        setStatisticsData(res.data.combinedData.statistics);
        setBarChartData(res.data.combinedData.barChartData);
      }
    };

    analytics();
  }, [selectedMonth]);

  useEffect(() => {
    const transactionData = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/v1/transactions?page=${page}&perPage=${perPage}&month=${
          months.indexOf(selectedMonth) + 1
        }&search=${search}`
      );

      if (res.data.success) {
        setTransactions(res.data.transactions);
        setSuccess(res.data.success);
        setTotal(res.data.total);
      }
    };

    transactionData();
  }, [page, perPage, search, selectedMonth]);

  const numberOfPages = total / perPage;

  const nextPage = () => {
    if (page < numberOfPages) {
      setPage(page + 1);
    } else {
      return;
    }
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    } else {
      return;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString().slice(0, 9);
  };

  const handleChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handlePerPageChange = (event) => {
    const selectedPerPage = parseInt(event.target.value);
    setPerPage(selectedPerPage);
  };

  return (
    <>
      <div className="min-h-screen ">
        <div className="flex justify-center items-center flex-col px-12 ">
          <div className="bg-white w-1/3 shadow-md shadow-gray-300 flex gap-2 justify-center items-center text-2xl font-semibold py-5 mt-5 rounded-full">
            <p>Transaction</p>
            <p>Dashboard</p>
          </div>

          <div className="flex mt-12 justify-between w-full ">
            <div>
              <div className="flex items-center justify-center ">
                <span className="text-sm font-semibold bg-yellow-300 rounded-r-none  rounded-md py-1.5 px-4 ">
                  Search
                </span>
                <input
                  type="text"
                  placeholder="Search transaction"
                  className=" outline-none px-2 py-1 rounded-l-none rounded-md"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="flex ">
                <label
                  className="text-sm font-semibold bg-yellow-300 py-1.5 px-4 rounded-r-none rounded-md"
                  htmlFor="monthSelect"
                >
                  Select Month
                </label>
                <select
                  id="monthSelect"
                  className="text-sm font-semibold bg-white py-1.5 px-4 rounded-l-none rounded-md"
                  value={selectedMonth}
                  onChange={handleChange}
                >
                  {months.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className=" mt-6 w-full max-h-96 overflow-y-auto ">
            <table className="table-auto bg-white w-full">
              <thead className="py-3 ">
                <tr className="text-left   bg-yellow-300">
                  <th className="p-3">Id</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Sold</th>
                  <th>Date Of Sale</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length !== 0 ? (
                  transactions.map((item) => (
                    <tr className="border-b font-semibold border-gray-400 ">
                      <td className="px-3 ">{item.id}</td>
                      <td className="font-semibold w-1/4">{item.title}</td>
                      <td className="text-xs w-1/5">{item.description}</td>
                      <td>&#x20B9; {parseFloat(item.price.toFixed(2))}</td>
                      <td>{item.category}</td>
                      <td>{item.sold ? "Yes" : "No"}</td>
                      <td>{formatDate(item.dateOfSale)}</td>
                      <td className="py-2">
                        <img src={item.image} className="w-32" alt="" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <div className=" py-12 text-center w-full font-semibold">
                    {success ? "No Data found" : "Loading..."}
                  </div>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between px-2 font-semibold py-2 w-full">
            <div>
              <p>Page No: {page}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={nextPage}>Next</button> -{" "}
              <button onClick={previousPage}>Previous</button>
            </div>
            <div>
              <div>
                Per Page:
                <select
                  value={perPage}
                  onChange={handlePerPageChange}
                  name=""
                  id=""
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                  <option value={60}>60</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <TransactionStatistics statisticsData={statisticsData} />
        <TransactionsBarChart
          selectedMonth={selectedMonth}
          barChartData={barChartData}
        />
      </div>
    </>
  );
};
