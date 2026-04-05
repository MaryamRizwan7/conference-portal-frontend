import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout"; // updated layout
import axios from "axios";

const AllConferences = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await axios.get("/api/conference/all-conferences");
        setConferences(response.data);
      } catch (error) {
        console.error("Error fetching conferences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConferences();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Approved Conferences</h1>
          <p className="mt-2 text-gray-500 font-medium">All conferences that have been approved on the platform.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 animate-spin rounded-full"></div>
          </div>
        ) : conferences.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 font-medium text-lg">No conferences found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Conference</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Deadlines</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {conferences.map((conference, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{conference.acronym}</div>
                        <div className="text-sm text-gray-500">{conference.conferenceName}</div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {conference.topics?.filter((t) => t && t.trim()).slice(0, 2).map((topic, i) => (
                            <span key={i} className="px-2 py-0.5 bg-red-50 text-red-700 rounded-md text-[10px] font-bold uppercase">{topic}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-700">{conference.city}</div>
                        <div className="text-xs text-gray-500">{conference.country}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-500 space-y-1">
                          <div><span className="font-bold text-gray-700">Submit:</span> {conference.submissionDeadline ? conference.submissionDeadline.slice(0, 10) : "-"}</div>
                          <div><span className="font-bold text-gray-700">Start:</span> {conference.startDate ? conference.startDate.slice(0, 10) : "-"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 uppercase">
                          {conference.status || "approved"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => (window.location.href = "/admindashboard/update-conference")}
                          className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 text-xs font-bold rounded-lg hover:bg-red-100 transition-all"
                        >
                          Edit
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
    </DashboardLayout>
  );
};

export default AllConferences;