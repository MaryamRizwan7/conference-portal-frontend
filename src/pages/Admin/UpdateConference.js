import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ConfirmationModal from "../../components/ConfirmationModal";
import Sidebar from "../../components/AdminSidebar";

const UpdateConference = () => {
  const navigate = useNavigate();
  const [conferences, setConferences] = useState([]);
  const [selectedConferenceId, setSelectedConferenceId] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue } = useForm();

  const fetchConferences = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/conference/all-conferences");
      setConferences(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching conferences.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSingleConference = async (id) => {
    try {
      const { data } = await axios.get(`/api/conference/get-conference/${id}`);
      setValue("conferenceName", data.conferenceName);
      setValue("acronym", data.acronym);
      setValue("webPage", data.webPage);
      setValue("venue", data.venue);
      setValue("city", data.city);
      setValue("country", data.country);
      setValue("startDate", data.startDate?.split("T")[0]);
      setValue("endDate", data.endDate?.split("T")[0]);
      setValue("abstractDeadline", data.abstractDeadline);
      setValue("submissionDeadline", data.submissionDeadline);
      setValue("primaryArea", data.primaryArea);
      setValue("secondaryArea", data.secondaryArea);
      setValue("topics", data.topics);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching conference details.");
    }
  };

  useEffect(() => {
    fetchConferences();
  }, []);

  const handleConferenceChange = (e) => {
    const id = e.target.value;
    setSelectedConferenceId(id);
    if (id) {
      getSingleConference(id);
    } else {
      ["conferenceName", "acronym", "webPage", "venue", "city", "country", "startDate", "endDate", "abstractDeadline", "submissionDeadline", "primaryArea", "secondaryArea", "topics"]
        .forEach((field) => setValue(field, ""));
    }
  };

  const onSubmit = async (formData) => {
    try {
      const { data } = await axios.put(`/api/conference/update-conference/${selectedConferenceId}`, formData);
      if (data?.success) {
        toast.success("Conference updated successfully.");
        navigate("/admindashboard/all-conferences");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleDelete = () => setIsModalVisible(true);

  const confirmDelete = async () => {
    try {
      setIsModalVisible(false);
      await axios.delete(`/api/conference/delete-conference/${selectedConferenceId}`);
      toast.success("Conference deleted successfully.");
      setSelectedConferenceId("");
      fetchConferences();
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const cancelDelete = () => setIsModalVisible(false);

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-200 focus:bg-white focus:outline-none transition-all duration-200 shadow-sm hover:border-gray-300 text-sm";
  const labelClass = "block text-sm font-bold text-gray-700 mb-1";

  return (
    <Layout title="ConForum Admin - Edit Conference">
      <div className="relative flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Conference</h1>
            <p className="mt-2 text-gray-500 font-medium">Select a conference to update or delete it.</p>
          </div>

          <div className="max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-8">
              <label className={labelClass}>Select Conference</label>
              <select
                onChange={handleConferenceChange}
                value={selectedConferenceId}
                className={inputClass}
              >
                <option value="">-- Choose a conference --</option>
                {conferences.map((conf) => (
                  <option key={conf._id} value={conf._id}>
                    {conf.acronym} — {conf.conferenceName}
                  </option>
                ))}
              </select>
            </div>

            {selectedConferenceId && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Conference Name</label>
                    <input type="text" {...register("conferenceName")} className={inputClass} placeholder="Conference Name" />
                  </div>
                  <div>
                    <label className={labelClass}>Acronym</label>
                    <input type="text" {...register("acronym")} className={inputClass} placeholder="e.g. ICML2025" />
                  </div>
                  <div>
                    <label className={labelClass}>Web Page</label>
                    <input type="text" {...register("webPage")} className={inputClass} placeholder="https://..." />
                  </div>
                  <div>
                    <label className={labelClass}>Venue</label>
                    <input type="text" {...register("venue")} className={inputClass} placeholder="Venue" />
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input type="text" {...register("city")} className={inputClass} placeholder="City" />
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input type="text" {...register("country")} className={inputClass} placeholder="Country" />
                  </div>
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input type="date" {...register("startDate")} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input type="date" {...register("endDate")} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Abstract Deadline</label>
                    <input type="date" {...register("abstractDeadline")} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Submission Deadline</label>
                    <input type="date" {...register("submissionDeadline")} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Primary Area</label>
                    <input type="text" {...register("primaryArea")} className={inputClass} placeholder="Primary Area" />
                  </div>
                  <div>
                    <label className={labelClass}>Secondary Area</label>
                    <input type="text" {...register("secondaryArea")} className={inputClass} placeholder="Secondary Area" />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Topics</label>
                    <input type="text" {...register("topics")} className={inputClass} placeholder="Topics (comma separated)" />
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-teal-900/20"
                    style={{ background: "linear-gradient(135deg, #2D5561, #4B707A)" }}
                  >
                    Update Conference
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-8 py-3 text-white font-bold bg-gray-800 rounded-xl transition-all duration-300 hover:bg-gray-900"
                  >
                    Delete Conference
                  </button>
                </div>
              </form>
            )}
          </div>

          {isModalVisible && (
            <ConfirmationModal onConfirm={confirmDelete} onCancel={cancelDelete} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateConference;