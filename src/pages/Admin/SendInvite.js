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
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await axios.get("/api/conference/all-reg-conferences");
        setConferences(response.data);
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
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedConference(null);
    setOrganizerEmail("");
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!organizerEmail) {
      toast.error("Please enter the organizer's email.");
      return;
    }
    setSending(true);
    try {
      await axios.post("/api/conference/send-invite", {
        conferenceId: selectedConference._id,
        organizerEmail,
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
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Send Invites</h1>
            <p className="mt-2 text-gray-500 font-medium">
              Invite an organizer to manage a specific approved conference.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 animate-spin rounded-full"></div>
            </div>
          ) : conferences.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <p className="text-gray-500 font-medium text-lg">No approved conferences found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Conference</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {conferences.map((conference, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">{conference.acronym}</div>
                          <div className="text-sm text-gray-500">{conference.conferenceName}</div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {conference.topics?.slice(0, 2).map((topic, i) => (
                              <span key={i} className="px-2 py-0.5 bg-red-50 text-red-700 rounded-md text-[10px] font-bold uppercase">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-700">{conference.city}</div>
                          <div className="text-xs text-gray-500">{conference.country}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {conference.startDate ? conference.startDate.slice(0, 10) : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 uppercase">
                            {conference.status || "approved"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openModal(conference)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all"
                            style={{ backgroundColor: "#9B0020", color: "white" }}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                            Send Invite
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

      {modalOpen && selectedConference && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-gray-900">Send Organizer Invite</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Conference</p>
              <p className="text-sm font-bold text-gray-900">{selectedConference.conferenceName}</p>
              <p className="text-xs text-gray-500 mt-0.5">{selectedConference.acronym} &bull; {selectedConference.city}, {selectedConference.country}</p>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Organizer Email Address
                </label>
                <input
                  type="email"
                  value={organizerEmail}
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                  placeholder="organizer@example.com"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:bg-white focus:outline-none transition-all duration-200 text-sm"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 py-3 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:opacity-60"
                  style={{ backgroundColor: "#9B0020" }}
                >
                  {sending ? "Sending..." : "Send Invite"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 text-gray-700 text-sm font-bold bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
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
