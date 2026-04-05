import React, { useState } from "react";
import Layout from "../../components/DashboardLayout";
import Sidebar from "../../components/AdminSidebar";
import axios from "axios";
import toast from "react-hot-toast";

const SendInvite = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(`Hello,

You have been invited to manage a conference on ConForum.

Please login to ConForum to start managing the conference.

Regards,
ConForum Team`);
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email || !message) return toast.error("Email and message are required");
    setSending(true);
    try {
      await axios.post("/api/conference/send-invite", { organizerEmail: email, message });
      toast.success(`Invite sent to ${email}!`);
      setEmail("");
      setMessage(`Hello,

You have been invited to manage a conference on ConForum.

Please login to ConForum to start managing the conference.

Regards,
ConForum Team`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send invite");
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout title="ConForum Admin - Send Invites">
      <div className="relative flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Send Organizer Invite</h1>
          <p className="text-gray-500 mb-6">Invite someone to become an organizer on ConForum.</p>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-5xl">
            <form onSubmit={handleSend} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Organizer Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="organizer@example.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 text-white font-bold rounded-xl bg-gradient-to-r from-teal-700 to-teal-500"
              >
                {sending ? "Sending..." : "Send Invite"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SendInvite;