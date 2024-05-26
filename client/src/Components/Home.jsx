import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import LineGraph from "./LineGraph";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [sortOrder2, setSortOrder2] = useState("asc");
  const [popup, setPopup] = useState(false);
  const [temp, setTemp] = useState({});
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [answers, setAnswers] = useState("");
  const [newData, setNewData] = useState([
    { year: "2024", data: { totalJobs: 0, totalSalary: 0, jobTitile: {} } },
    { year: "2023", data: { totalJobs: 0, totalSalary: 0, jobTitile: {} } },
    { year: "2022", data: { totalJobs: 0, totalSalary: 0, jobTitile: {} } },
    { year: "2021", data: { totalJobs: 0, totalSalary: 0, jobTitile: {} } },
    { year: "2020", data: { totalJobs: 0, totalSalary: 0, jobTitile: {} } },
  ]);
  const [dataTemp, setDataTemp] = useState(newData);
  const [chatPopUp, setChatPopUp] = useState(false);
  const handleData = (currentData) => {
    currentData?.forEach((obj) => {
      dataTemp.map((item) => {
        if (obj.work_year === item.year) {
          item.data.totalJobs = item.data.totalJobs + 1;
          item.data.totalSalary = item.data.totalSalary + parseInt(obj.salary);
          if (item.data.jobTitile[obj.job_title] !== undefined) {
            item.data.jobTitile[obj.job_title] =
              item.data.jobTitile[obj.job_title] + 1;
          } else {
            item.data.jobTitile[obj.job_title] = 1;
          }
          return item;
        }
      });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/salaries.csv");
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder("utf-8");
        const csv = decoder.decode(result.value);
        const parsedData = Papa.parse(csv, { header: true }).data;
        setData(parsedData);
        handleData(parsedData);
        setNewData(dataTemp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handlePopup = (obj) => {
    setPopup(true);
    setTemp(obj);
    console.log(obj);
  };
  const sortedEntries = Object.entries(temp)?.sort(
    ([keyA, valueA], [keyB, valueB]) => {
      if (sortOrder === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    }
  );

  const sortedEntriesSalary = [...newData].sort((a, b) => {
    const valueA = a.data.totalSalary / a.data.totalJobs;
    const valueB = b.data.totalSalary / b.data.totalJobs;
    if (sortOrder2 === "asc") {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  const handleClose = () => {
    setPopup(false);
    setTemp({});
    setSearch("");
  };

  const handleMessage = async () => {
    // Api call to open Ai to get Answer
    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:5000/api/getchatdata",
        {
          message,
        }
      );
      setAnswers(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };
  return (
    <div className="md:grid md:grid-cols-2 sm:grid sm:grid-row-2  gap-1 h-screen pt-10 md:overflow-hidden ">
      <div className="w-full h-14  bg-gradient-to-r from-blue-600  to-sky-300 fixed top-0 flex items-center justify-center">
        <h1 className="text-3xl text-white  font-bold">Floqer's Assignment</h1>
      </div>
      <div className="w-full flex flex-col items-center ">
        <div className="bg-gray-700 p-3 px-10 rounded-2xl mt-5">
          <h1 className="text-2xl text-white font-bold">Main Table</h1>
        </div>

        <table className="w-3/4 mt-10 border-2 border-black">
          <thead className="border border-black bg-blue-500 text-white">
            <th className="p-3 ">Year</th>
            <th className="p-3">No. of Jobs</th>
            <th className="p-3 flex flex-col">
              Average Salary
              <select
                onChange={(e) => setSortOrder2(e.target.value)}
                className="bg-white text-black"
              >
                <option value="asc">Lowest to Highest</option>
                <option value="des">Highest to Lowest</option>
              </select>
            </th>
          </thead>
          <tbody>
            {sortedEntriesSalary?.map((item, index) => {
              return (
                <tr
                  onClick={() => handlePopup(item.data.jobTitile)}
                  className=" hover:text-white cursor-pointer "
                  style={{
                    backgroundColor:
                      index % 2 === 0
                        ? "rgba(95 , 135 , 254 , 0.59)"
                        : "rgba(19 , 76 , 246, 0.59)",
                  }}
                >
                  <td className="pl-6 p-3 underline ">{item.year}</td>
                  <td className="pl-10 ">{item.data.totalJobs}</td>
                  <td className="pl-14">
                    {parseFloat(
                      item.data.totalSalary / item.data.totalJobs
                    ).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {popup && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="w-full absolute top-2 flex justify-center ">
              <h1 className="text-3xl text-white font-bold bg-gray-700 p-3 px-10 rounded-2xl">
                Aggregate Job Titles
              </h1>
            </div>
            <CloseIcon
              sx={{
                width: "2rem",
                height: "2rem",
                position: "absolute",
                top: "1rem",
                right: { xs: "2rem", md: "5rem" },
                color: "black",
                bgcolor: "red",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              onClick={handleClose}
            />
            <div
              className="bg-white w-3/4 h-3/4 p-5 overflow-y-auto flex justify-center rounded-lg 
            "
            >
              <table className="w-3/4 m-5 ">
                <thead>
                  <th>
                    Job Title{" "}
                    <div className="w-full flex items-center justify-center">
                      <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                        className="w-3/4 font-normal  border-2 border-black rounded-sm p-1"
                      />
                    </div>
                  </th>
                  <th className="flex flex-col">
                    No of Jobs
                    <select onChange={(e) => setSortOrder(e.target.value)}>
                      <option value="asc">Lowest to Highest</option>
                      <option value="des">Highest to Lowest</option>
                    </select>
                  </th>
                </thead>
                <tbody>
                  {sortedEntries
                    ?.filter((item) => {
                      const [key, value] = item;
                      return search === ""
                        ? item
                        : key.toLowerCase().startsWith(search.toLowerCase())
                        ? key
                        : key.toLowerCase().includes(search.toLowerCase());
                    })
                    .map(([key, value], index) => {
                      return (
                        <tr
                          className="h-10"
                          style={{
                            backgroundColor:
                              index % 2 === 0
                                ? "rgba(95 , 135 , 254 , 0.59)"
                                : "rgba(19 , 76 , 246, 0.59)",
                          }}
                        >
                          <td className="max-w-1/2 flex items-center justify-center sm:text-xs">
                            {key}
                          </td>
                          <td className="p-2 pl-20 sm:text-xs ">{value}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {chatPopUp && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="w-full absolute top-2 flex justify-center ">
              <h1 className="text-3xl text-white font-bold bg-gray-700 p-3 px-10 rounded-2xl">
                ChatBot
              </h1>
            </div>
            <CloseIcon
              sx={{
                width: "2rem",
                height: "2rem",
                position: "absolute",
                top: "1rem",
                right: { xs: "2rem", md: "5rem" },
                color: "black",
                bgcolor: "red",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              onClick={() => setChatPopUp(false)}
            />
            <div
              className="bg-white w-3/4 h-3/4 p-5 overflow-y-auto flex flex-col  rounded-lg 
            "
            >
              <div className="w-full h-3/4 p-4 px-10  overflow-y-auto">
                {answers === "" && loading === false && (
                  <h1 className="text-3xl  text-slate-300">No Messages Yet</h1>
                )}
                {loading ? (
                  <h1 className="text-3xl  text-slate-300">Loading ...</h1>
                ) : (
                  <p className="typing">{answers}</p>
                )}
              </div>
              <div className="w-full h-1/3 flex items-end ">
                <input
                  type="text"
                  placeholder="Send Message"
                  className="p-4 w-full h-10 border border-slate-400 "
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className="p-3"
                  onClick={handleMessage}
                  disabled={loading}
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <LineGraph newData={newData} />
      </div>
      <button
        className="fixed bottom-10 left-5 p-2 px-6 rounded-xl bg-orange-400 text-white hover:bg-orange-600 "
        onClick={() => setChatPopUp(true)}
      >
        ChatBot
      </button>
    </div>
  );
};

export default Home;
