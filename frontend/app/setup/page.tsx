'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/services/supabaseClient';

export default function SetupPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [income, setIncome] = useState('');
  const [savings, setSavings] = useState('');
  const [error, setError] = useState('');

  const [expenses, setExpenses] = useState({
    rent: '',
    utilities: '',
    groceries: '',
    transportation: '',
    miscellaneous: '',
  });

  const [customExpenses, setCustomExpenses] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const alreadySetup = localStorage.getItem('setupComplete');
    if (alreadySetup === 'true') router.push('/dashboard');
  }, [router]);

  const handleNext = () => {
    if (!income || !savings) {
      setError('Please fill out both income and savings.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in.');
      return;
    }

    const uid = user.uid;
    const allExpenses = {
      ...expenses,
      ...Object.fromEntries(
        customExpenses.filter(e => e.label && e.value).map(({ label, value }) => [label, value])
      ),
    };

    try {
      // 1. Insert user if not exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('firebase_uid', uid)
        .single();

      let userId = existingUser?.id;

      if (!userId) {
        const { data: newUser, error } = await supabase
          .from('users')
          .insert({
            firebase_uid: uid,
            email: user.email,
            full_name: user.displayName,
          })
          .select()
          .single();
        if (error) throw error;
        userId = newUser.id;
      }

      // 2. Insert finance
      await supabase.from('finances').insert({
        user_id: userId,
        monthly_income: Number(income),
        total_savings: Number(savings),
      });

      // 3. Insert expenses
      const expenseRows = Object.entries(allExpenses).map(([category, amount]) => ({
        user_id: userId,
        category,
        amount: Number(amount),
      }));

      await supabase.from('expenses').insert(expenseRows);

      // Done!
      localStorage.setItem('setupComplete', 'true');
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to save data. Please try again.');
    }
  };

  const addCustomField = () => {
    setCustomExpenses([...customExpenses, { label: '', value: '' }]);
  };

  const updateCustomField = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...customExpenses];
    updated[index][field] = value;
    setCustomExpenses(updated);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center">
          {step === 1 ? 'Set Up Your Finances' : 'Add Your Monthly Expenses'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Monthly Income</label>
              <input
                type="number"
                placeholder="e.g. 1200"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Regular income you receive each month.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Total Savings</label>
              <input
                type="number"
                placeholder="e.g. 3500"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Amount you’ve saved so far. Used to calculate net worth.
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Continue to Expenses →
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {Object.entries(expenses).map(([key, val]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="number"
                  placeholder={`e.g. 100`}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={val}
                  onChange={(e) =>
                    setExpenses((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              </div>
            ))}

            {/* Custom Fields */}
            {customExpenses.map((entry, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Label (e.g. Subscriptions)"
                  className="w-1/2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={entry.label}
                  onChange={(e) => updateCustomField(index, 'label', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-1/2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={entry.value}
                  onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                />
              </div>
            ))}

            <button
              onClick={addCustomField}
              className="w-full text-blue-600 font-semibold border border-blue-300 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              + Add Custom Expense
            </button>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Finish Setup & Go to Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Simple animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
