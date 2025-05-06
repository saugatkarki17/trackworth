"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Trash2, ArrowRightCircle } from "lucide-react";

export default function UpdateExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<{ category: string; amount: string }[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;

      const { data: userRow } = await supabase
        .from("users")
        .select("id")
        .eq("firebase_uid", user.uid)
        .single();

      if (!userRow) return;

      const { data } = await supabase
        .from("expenses")
        .select("category, amount")
        .eq("user_id", userRow.id);

      if (data) {
        const formatted = data.map((e) => ({
          category: e.category,
          amount: e.amount.toString(),
        }));
        setExpenses(formatted);
      }
    };

    fetchExpenses();
  }, [user]);

  const handleChange = (index: number, field: "category" | "amount", value: string) => {
    const updated = [...expenses];
    updated[index][field] = value;
    setExpenses(updated);
  };

  const addExpense = () => {
    setExpenses([...expenses, { category: "", amount: "" }]);
  };

  const removeExpense = (index: number) => {
    const updated = [...expenses];
    updated.splice(index, 1);
    setExpenses(updated);
  };

  const handleSubmit = async () => {
    if (!user) return;

    const { data: userRow } = await supabase
      .from("users")
      .select("id")
      .eq("firebase_uid", user.uid)
      .single();

    if (!userRow) return;

    const userId = userRow.id;

    await supabase.from("expenses").delete().eq("user_id", userId);

    const validExpenses = expenses
      .filter((e) => e.category && e.amount)
      .map(({ category, amount }) => ({
        user_id: userId,
        category,
        amount: Number(amount),
      }));

    await supabase.from("expenses").insert(validExpenses);
    setMessage("✅ Your expenses have been updated.");
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">💸 Update Your Expenses</h1>

      {message && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}

      <div className="grid gap-6">
        {expenses.map((expense, index) => (
          <div key={index} className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={expense.category}
                onChange={(e) => handleChange(index, "category", e.target.value)}
                placeholder="e.g. Groceries"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                value={expense.amount}
                onChange={(e) => handleChange(index, "amount", e.target.value)}
                placeholder="e.g. 120"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="pt-5">
              <button
                onClick={() => removeExpense(index)}
                className="text-red-500 hover:text-red-700"
                title="Remove"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-4 justify-between items-center">
        <button
          onClick={addExpense}
          className="text-blue-600 font-semibold border border-blue-300 py-2 px-4 rounded-lg hover:bg-blue-50 transition"
        >
          + Add New Expense
        </button>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-lg hover:bg-blue-700 transition"
        >
          <ArrowRightCircle size={18} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
