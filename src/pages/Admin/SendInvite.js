import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../../components/AdminSidebar";

const SendInvite = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConference, setSelectedConference] = useState(null);
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await axios.get("/api/conference/all-reg-conferences");
        setConferences(response.data.filter((c) => c.status === "approved"));
      } catch (error) {
        console.error("Error fetching conferences:", error);
        toast.error("Failed to load conferences");
      } finally {
        setLoading(false);
      }
    };
    fetchConferences();
  }, []);

  const openModal = (conference) => {
    setSelectedConference(conference);
    setOrganizerEmail("");
    setMessage(
      `Hello,\n\nYou have been invited to manage the conference "${conference.conferenceName}".\n\nPlease login to ConForum to start managing the conference.\n\nRegards,\nConForum Team`
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedConference(null);
    setOrganizerEmail("");
    setMessage("");
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!organizerEmail) { toast.error("Please enter the organizer's email."); return; }
    if (!message) { toast.error("Please enter a message."); return; }
    setSending(true);
    try {
      await axios.post("/api/conference/send-invite", {
        conferenceId: selectedConference._id,
        organizerEmail,
        message,
      });
      toast.success(`Invite sent to ${organizerEmail} for "${selectedConference.conferenceName}"!`);
      closeModal();
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
              Send Invites
            </h1>
            <p className="mt-2 text-gray-500 font-medium">
              Invite an organizer to manage a specific approved conference.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 animate-spin rounded-full" />
            </div>
          ) : conferences.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <p className="text-gray-500 font-medium text-lg">
                No approved conferences found.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Conference</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Start Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {conferences.map((conference, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">{conference.acronym}</div>
                          <div className="text-sm text-gray-500">{conference.conferenceName}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {conference.city}, {conference.country}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {conference.startDate ? conference.startDate.slice(0, 10) : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 uppercase">
                            {conference.status || "approved"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openModal(conference)}
                            className="px-4 py-2 text-xs font-bold rounded-lg text-white transition-all duration-200 hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #2D5561, #4B707A)" }}
                          >
                            Send Organizer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedConference && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100">

            {/* Modal Header */}
            <div
              className="h-2 -mx-8 -mt-8 mb-6 rounded-t-2xl"
              style={{ background: "linear-gradient(90deg, #4B707A, #7F9C8E, #C5D9A4)" }}
            />

            <h2 className="text-xl font-extrabold text-gray-900 mb-6">
              Send Organizer
            </h2>

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
                  rows="5"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 py-3 text-white text-sm font-bold rounded-xl transition-all duration-200 hover:opacity-90 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #2D5561, #4B707A)" }}
                >
                  {sending ? "Sending..." : "Send Organizer"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 text-gray-700 text-sm font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SendInvite;