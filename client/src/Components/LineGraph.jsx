import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement,
} from "chart.js";

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LineGraph = ({ newData }) => {
  const salaries = {
    labels: newData?.map((d) => d.year),
    datasets: [
      {
        label: "Average Salary",
        data: newData?.map((d) => d.data.totalSalary / d.data.totalJobs),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const Jobs = {
    labels: newData?.map((d) => d.year),
    datasets: [
      {
        label: "No of Jobs",
        data: newData?.map((d) => d.data.totalJobs),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };
  return (
    <div className="w-full h-3/4">
      <div className="w-full  flex justify-center ">
        <h1 className="text-3xl text-white font-bold bg-gray-700 p-3 px-10 rounded-2xl mt-5">
          Graphs
        </h1>
      </div>
      <div className="w-full h-screen grid grid-rows-2 grid-col-1 gap-0 ">
        <div className="w-3/4 h-full m-5">
          <Line data={salaries} />
        </div>
        <div className="w-3/4 h-3/4  m-5 mb-15 pb-5">
          <Bar data={Jobs} />
        </div>
      </div>
    </div>
  );
};

export default LineGraph;
