"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateEmail, updatePassword } from "firebase/auth";
import { MailCheck, KeyRound, User2 } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleEmailChange = async () => {
    try {
      if (user && email !== user.email) {
        await updateEmail(user, email);
        setMessage({ text: "✅ Email updated successfully!", type: "success" });
      }
    } catch (err) {
      setMessage({
        text: "❌ Failed to update email. Try logging in again.",
        type: "error",
      });
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (newPassword.length < 6) {
        return setMessage({
          text: "❌ Password must be at least 6 characters.",
          type: "error",
        });
      }
      if (user) {
        await updatePassword(user, newPassword);
        setMessage({ text: "✅ Password updated successfully!", type: "success" });
        setNewPassword("");
      }
    } catch (err) {
      setMessage({
        text: "❌ Failed to update password. Try logging in again.",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6 flex flex-col space-y-8">
      <div className="flex items-center gap-3">
        <User2 className="text-blue-600 w-6 h-6" />
        <h2 className="text-3xl font-bold text-blue-600">Manage Your Profile</h2>
      </div>
      <p className="text-gray-600">
        Update your account credentials securely. Your changes will take effect immediately.
      </p>

      {message.text && (
        <div
          className={`px-4 py-3 rounded text-sm shadow-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Email Section */}
        <div className="bg-white p-6 rounded-xl shadow border space-y-4">
          <label className="block font-medium text-gray-700">Change Email</label>
          <input
            type="email"
            value={email}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleEmailChange}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center gap-2 transition"
          >
            <MailCheck className="w-5 h-5" />
            Update Email
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border space-y-4">
          <label className="block font-medium text-gray-700">Change Password</label>
          <input
            type="password"
            value={newPassword}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
          />
          <button
            onClick={handlePasswordChange}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center gap-2 transition"
          >
            <KeyRound className="w-5 h-5" />
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
