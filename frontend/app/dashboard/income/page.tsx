// app/dashboard/income.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { DollarSign, PiggyBank, TrendingUp, Save } from "lucide-react";

export default function UpdateIncomePage() {
  const { user } = useAuth();
  const [income, setIncome] = useState("");
  const [savings, setSavings] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchIncomeData = async () => {
      if (!user) return;

      const { data: userRow } = await supabase
        .from("users")
        .select("id")
        .eq("firebase_uid", user.uid)
        .single();

      if (!userRow) return;

      const { data } = await supabase
        .from("finances")
        .select("monthly_income, total_savings")
        .eq("user_id", userRow.id)
        .single();

      if (data) {
        setIncome(data.monthly_income || "");
        setSavings(data.total_savings || "");
      }
    };

    fetchIncomeData();
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;

    const { data: userRow } = await supabase
      .from("users")
      .select("id")
      .eq("firebase_uid", user.uid)
      .single();

    if (!userRow) return;

    // Delete previous finance record (enforces 1 row per user)
    await supabase.from("finances").delete().eq("user_id", userRow.id);

    // Insert new finance row
    await supabase.from("finances").insert({
      user_id: userRow.id,
      monthly_income: Number(income),
      total_savings: Number(savings),
    });

    setMessage("✅ Income updated!");
    setTimeout(() => setMessage(""), 3000);
  };

  const netWorth =
    (parseFloat(income || "0") || 0) * 12 + (parseFloat(savings || "0") || 0);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 flex flex-col space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-blue-600">Update Your Finances</h2>
          <p className="text-gray-600 mt-1">
            Manage your income and savings for smarter financial insights.
          </p>
        </div>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-sm shadow-sm">
            {message}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm rounded-xl p-5 border">
          <div className="flex items-center gap-3 text-blue-600 font-semibold text-lg">
            <DollarSign className="w-5 h-5" />
            Monthly Income
          </div>
          <p className="text-2xl font-bold mt-2 text-gray-800">${income || 0}</p>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-5 border">
          <div className="flex items-center gap-3 text-blue-600 font-semibold text-lg">
            <PiggyBank className="w-5 h-5" />
            Total Savings
          </div>
          <p className="text-2xl font-bold mt-2 text-gray-800">${savings || 0}</p>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-5 border">
          <div className="flex items-center gap-3 text-blue-600 font-semibold text-lg">
            <TrendingUp className="w-5 h-5" />
            Estimated Net Worth
          </div>
          <p className="text-2xl font-bold mt-2 text-gray-800">
            ${netWorth.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-6 shadow-md rounded-xl space-y-4 border">
          <label className="block font-semibold text-gray-700 mb-1">Monthly Income</label>
          <input
            type="number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={income}
            placeholder="e.g. 2500"
            onChange={(e) => setIncome(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            How much you earn per month after tax.
          </p>
        </div>

        <div className="bg-white p-6 shadow-md rounded-xl space-y-4 border">
          <label className="block font-semibold text-gray-700 mb-1">Total Savings</label>
          <input
            type="number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={savings}
            placeholder="e.g. 8000"
            onChange={(e) => setSavings(e.target.value)}
          />
          <p className="text-xs text-gray-500">All your current bank and cash savings.</p>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 flex gap-2 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition"
        >
           <Save className="w-5 h-5" />
           Save Financial Changes
        </button>
      </div>
    </div>
  );
}