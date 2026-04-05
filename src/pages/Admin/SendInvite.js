import React, { useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../../components/AdminSidebar";

const SendInvite = () => {
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [message, setMessage] = useState(
    `Hello,\n\nYou have been invited to manage a conference on ConForum.\n\nPlease login to ConForum to start managing the conference.\n\nRegards,\nConForum Team`
  );
  const [sending, setSending] = useState(false);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!organizerEmail) { toast.error("Please enter the organizer's email."); return; }
    if (!message) { toast.error("Please enter a message."); return; }
    setSending(true);
    try {
      await axios.post("/api/conference/send-invite", {
        organizerEmail,
        message,
      });
      toast.success(`Invite sent to ${organizerEmail}!`);
      setOrganizerEmail("");
      setMessage(
        `Hello,\n\nYou have been invited to manage a conference on ConForum.\n\nPlease login to ConForum to start managing the conference.\n\nRegards,\nConForum Team`
      );
    } catch (error) {
      console.error("Error sending invite:", error);
      toast.error(error?.response?.data?.message || "Failed to send invite.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout title="ConForum Admin - Send Invites">
      <div className="relative flex min-h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Send Organizer Invite
            </h1>
            <p className="mt-2 text-gray-500 font-medium">
              Invite someone to become an organizer on ConForum.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg p-8">
            <div
              className="h-2 -mx-8 -mt-8 mb-6 rounded-t-2xl"
              style={{ background: "linear-gradient(90deg, #4B707A, #7F9C8E, #C5D9A4)" }}
            />

            <form onSubmit={handleSendInvite} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Organizer Email
                </label>
                <input
                  type="email"
                  value={organizerEmail}
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                  placeholder="organizer@example.com"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="6"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 text-white text-sm font-bold rounded-xl transition-all duration-200 hover:opacity-90 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #2D5561, #4B707A)" }}
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