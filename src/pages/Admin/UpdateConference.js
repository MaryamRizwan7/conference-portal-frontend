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
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
      [
        "conferenceName",
        "acronym",
        "webPage",
        "venue",
        "city",
        "country",
        "startDate",
        "endDate",
        "abstractDeadline",
        "submissionDeadline",
        "primaryArea",
        "secondaryArea",
        "topics",
      ].forEach((field) => setValue(field, ""));
    }
  };

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const { data } = await axios.put(
        `/api/conference/update-conference/${selectedConferenceId}`,
        formData
      );

      if (data?.success) {
        toast.success("Conference updated successfully.");
        navigate("/admindashboard/all-conferences");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => setIsModalVisible(true);

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      setIsModalVisible(false);

      await axios.delete(
        `/api/conference/delete-conference/${selectedConferenceId}`
      );

      toast.success("Conference deleted successfully.");
      setSelectedConferenceId("");
      fetchConferences();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDelete = () => setIsModalVisible(false);

  const inputClass =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-200 focus:bg-white focus:outline-none transition-all duration-200 shadow-sm hover:border-gray-300 text-sm";
  const labelClass = "block text-sm font-bold text-gray-700 mb-1";

  return (
    <Layout title="ConForum Admin - Edit Conference">
      <div className="relative flex min-h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Edit Conference
            </h1>
            <p className="mt-2 text-gray-500 font-medium">
              Select a conference to update or delete it.
            </p>
          </div>

          <div className="max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-8">
              <label className={labelClass}>Select Conference</label>

              <select
                onChange={handleConferenceChange}
                value={selectedConferenceId}
                className={inputClass}
                disabled={isLoading}
              >
                <option value="">
                  {isLoading ? "Loading conferences..." : "-- Choose a conference --"}
                </option>

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
                  {[
                    ["Conference Name", "conferenceName"],
                    ["Acronym", "acronym"],
                    ["Web Page", "webPage"],
                    ["Venue", "venue"],
                    ["City", "city"],
                    ["Country", "country"],
                  ].map(([label, name]) => (
                    <div key={name}>
                      <label className={labelClass}>{label}</label>
                      <input
                        type="text"
                        {...register(name)}
                        className={inputClass}
                      />
                    </div>
                  ))}

                  {[
                    ["Start Date", "startDate"],
                    ["End Date", "endDate"],
                    ["Abstract Deadline", "abstractDeadline"],
                    ["Submission Deadline", "submissionDeadline"],
                  ].map(([label, name]) => (
                    <div key={name}>
                      <label className={labelClass}>{label}</label>
                      <input
                        type="date"
                        {...register(name)}
                        className={inputClass}
                      />
                    </div>
                  ))}

                  {[
                    ["Primary Area", "primaryArea"],
                    ["Secondary Area", "secondaryArea"],
                  ].map(([label, name]) => (
                    <div key={name}>
                      <label className={labelClass}>{label}</label>
                      <input
                        type="text"
                        {...register(name)}
                        className={inputClass}
                      />
                    </div>
                  ))}

                  <div className="md:col-span-2">
                    <label className={labelClass}>Topics</label>
                    <input
                      type="text"
                      {...register("topics")}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 text-white font-bold rounded-xl shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #2D5561, #4B707A)",
                    }}
                  >
                    {isLoading ? "Updating..." : "Update Conference"}
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="px-8 py-3 text-white font-bold bg-gray-800 rounded-xl hover:bg-gray-900"
                  >
                    Delete Conference
                  </button>
                </div>
              </form>
            )}
          </div>

          {isModalVisible && (
            <ConfirmationModal
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateConference;