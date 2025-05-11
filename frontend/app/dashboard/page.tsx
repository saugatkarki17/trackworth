"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/services/supabaseClient";
import { Bar, Radar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineController,
  BarController,
  RadarController,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import type { ChartOptions } from "chart.js";

ChartJS.register(
  LineController,
  BarController,
  RadarController,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler
);


export default function Dashboard() {
  const { user } = useAuth();
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [savings, setSavings] = useState(0);
  const [expenses, setExpenses] = useState<{ category: string; amount: number }[]>([]);
  const [netWorth, setNetWorth] = useState(0);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIndex = new Date().getMonth();
  const remainingMonths = monthNames.slice(currentMonthIndex);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: userRow } = await supabase
        .from("users")
        .select("id")
        .eq("firebase_uid", user.uid)
        .single();

      if (!userRow) return;
      const userId = userRow.id;

      const { data: financeData } = await supabase
        .from("finances")
        .select("monthly_income, total_savings")
        .eq("user_id", userId)
        .single();

      if (financeData) {
        setMonthlyIncome(financeData.monthly_income || 0);
        setSavings(financeData.total_savings || 0);
      }

      const { data: expenseData } = await supabase
        .from("expenses")
        .select("category, amount")
        .eq("user_id", userId);

      if (expenseData) {
        setExpenses(expenseData);
      }
    };

    fetchData();
  }, [user]);

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  useEffect(() => {
    const remaining = 12 - new Date().getMonth();
    const estimated = savings + (monthlyIncome - totalExpenses) * remaining;
    setNetWorth(estimated);
  }, [savings, monthlyIncome, totalExpenses]);

  const coolColors = [
    "#6366f1", "#14b8a6", "#f97316", "#ef4444", "#0ea5e9", "#a855f7", "#22c55e"
  ];

  const comparisonData = {
    labels: ["Income", "Expenses", "Savings"],
    datasets: [
      {
        label: "Amount ($)",
        data: [monthlyIncome, totalExpenses, savings],
        backgroundColor: [
          "rgba(59, 130, 246, 0.85)",
          "rgba(239, 68, 68, 0.85)",
          "rgba(16, 185, 129, 0.85)",
        ],
        borderRadius: 8,
        borderWidth: 1,
        barThickness: 80,
      },
    ],
  };

  const comparisonOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1000,
          color: "#6b7280",
          callback: (val) => `$${val}`,
        },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: { color: "#6b7280" },
        grid: { display: false },
      },
    },
  };

  const radarData = {
    labels: expenses.map((e) => e.category),
    datasets: [
      {
        label: "Expense Breakdown",
        data: expenses.map((e) => e.amount),
        backgroundColor: "rgb(59, 130 ,246,0.2)",
        borderColor: "#3459E2",
        pointBackgroundColor: coolColors,
        borderWidth: 2,
      },
    ],
  };

  const radarOptions: ChartOptions<"radar"> = {
    responsive: true,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: Math.max(...expenses.map((e) => e.amount), 500),
        ticks: {
          stepSize: 200,
          color: "#6b7280",
          backdropColor: "transparent",
        },
        angleLines: { color: "#e5e7eb" },
        pointLabels: {
          color: "#374151",
          font: { size: 14 },
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  const netWorthTimelineData = {
    labels: remainingMonths,
    datasets: [
      {
        label: "Projected Net Worth",
        data: remainingMonths.map((_, i) =>
          savings + (monthlyIncome - totalExpenses) * (i + 1)
        ),
        borderColor: "#3459E2",
        backgroundColor: "rgb(59, 130 ,246,0.2)",
        tension: 0.4,
        pointRadius: 4,
        fill: true,
      },
    ],
  };

  return (
    <div className="w-full min-h-screen p-3 bg-gray-50">
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Monthly Income" value={`$${monthlyIncome}`} />
        <StatCard label="Monthly Expenses" value={`$${totalExpenses}`} />
        <StatCard label="Total Savings" value={`$${savings}`} />
        <StatCard label="Est. Net Worth (Year End)" value={`$${netWorth.toLocaleString()}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-8 border">
          <h2 className="text-lg font-semibold mb-6 text-gray-700">Financial Overview</h2>
          <Bar data={comparisonData} options={comparisonOptions} />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-md border">
              <span>Income</span>
              <span className="font-semibold text-blue-600">${monthlyIncome}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-md border">
              <span>Expenses</span>
              <span className="font-semibold text-red-500">${totalExpenses}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-md border">
              <span>Savings</span>
              <span className="font-semibold text-green-600">${savings}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 border flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-6 text-gray-700">Expense Breakdown</h2>
          {expenses.length > 0 ? (
            <div className="w-[400px] h-[400px]">
              <Radar data={radarData} options={radarOptions} />
            </div>
          ) : (
            <p className="text-sm text-gray-500">No expenses yet.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border mt-6 h-[30rem]">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Net Worth Timeline Prediction ({remainingMonths[0]} - {remainingMonths.at(-1)})
        </h2>
        <div className="h-[22rem] w-full">
        <Line
          data={netWorthTimelineData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: "#6b7280" },
                grid: { color: "#e5e7eb" },
              },
              x: {
                ticks: { color: "#6b7280" },
                grid: { color: "#f3f4f6" },
              },
            },
            plugins: {
              legend: { display: false },
            },
          }}
        />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}
