import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/Auth";
import DashboardLayout from "../../components/DashboardLayout"; // Use your new layout

function AdminConferenceCreationForm() {
  const [auth] = useAuth();

  const initialFormData = {
    conferenceName: "",
    acronym: "",
    webPage: "",
    mode: "",
    venue: "",
    city: "",
    country: "",
    startDate: "",
    endDate: "",
    abstractDeadline: "",
    submissionDeadline: "",
    primaryArea: "",
    secondaryArea: "",
    topics: ["", "", "", ""],
    expertise: [],
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "expertise"
          ? value.split(",").map((item) => item.trim())
          : value,
    }));
  };

  const handleTopicChange = (index, value) => {
    const updatedTopics = [...formData.topics];
    updatedTopics[index] = value;
    setFormData({ ...formData, topics: updatedTopics });
  };

  const validateRequiredFields = () => {
    const { conferenceName, acronym, startDate, endDate, mode, expertise } = formData;
    if (!conferenceName.trim()) { toast.error("Conference Name is required."); return false; }
    if (!acronym.trim()) { toast.error("Acronym is required."); return false; }
    if (!startDate || !endDate) { toast.error("Start and End dates are required."); return false; }
    if (!mode) { toast.error("Please select a Review Mode."); return false; }
    if (!expertise || expertise.length === 0 || expertise.every((e) => e.trim() === "")) {
      toast.error("At least one expertise is required."); return false;
    }
    return true;
  };

  const validateDates = () => {
    const { startDate, endDate, abstractDeadline, submissionDeadline } = formData;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const abstract = new Date(abstractDeadline);
    const submission = new Date(submissionDeadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!startDate || !endDate || !abstractDeadline || !submissionDeadline) {
      toast.error("All date fields must be filled."); return false;
    }
    if (start < today || end < today || abstract < today || submission < today) {
      toast.error("Dates must not be in the past."); return false;
    }
    if (end < start) { toast.error("End date must be greater than start date."); return false; }
    if (abstract > end) { toast.error("Abstract deadline must be before conference end date."); return false; }
    if (submission < start || submission > end) {
      toast.error("Submission deadline must lie between start and end date."); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateRequiredFields()) return;
    if (!validateDates()) return;

    try {
      await axios.post(
        "/api/conference/create-conference",
        { ...formData, userId: auth?.user?._id },
        { headers: { Authorization: auth?.token } }
      );
      toast.success("Conference created successfully!");
      setFormData(initialFormData);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <DashboardLayout title="Admin — Create Conference">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Create Conference
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Register a new conference directly as administrator
            </p>
          </div>
          <span
            className="px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-widest"
            style={{ background: "linear-gradient(135deg, #2D5561, #4B707A)" }}
          >
            System Superuser
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Conference Details</h2>
            <p className="text-xs text-gray-400 mt-1">Fill in the details below. Fields marked with * are required.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">

            {/* General Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-l-4 border-teal-600 pl-3 uppercase tracking-wider">
                General Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Conference Full Name <span className="text-teal-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="conferenceName"
                    value={formData.conferenceName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-200 focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="e.g. Int. Conference on Machine Learning"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Acronym <span className="text-teal-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="acronym"
                    value={formData.acronym}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-200 focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="e.g. ICML 2026"
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Official Website
                  </label>
                  <input
                    type="url"
                    name="webPage"
                    value={formData.webPage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-200 focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="https://conference.example.org"
                  />
                </div>
              </div>
            </div>

            {/* Venue & Location */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-l-4 border-teal-600 pl-3 uppercase tracking-wider">
                Venue & Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: "Venue", name: "venue", placeholder: "Convention Center" },
                  { label: "City", name: "city", placeholder: "New York" },
                  { label: "Country", name: "country", placeholder: "USA" },
                ].map(({ label, name, placeholder }) => (
                  <div key={name} className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
                    <input
                      type="text"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-200 focus:bg-white focus:outline-none transition-all text-sm"
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Key Deadlines & Dates */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-l-4 border-teal-600 pl-3 uppercase tracking-wider">
                Key Deadlines & Dates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: "Start Date *", name: "startDate" },
                  { label: "End Date *", name: "endDate" },
                  { label: "Abstract Deadline", name: "abstractDeadline" },
                  { label: "Submission Deadline", name: "submissionDeadline" },
                ].map(({ label, name }) => (
                  <div key={name} className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
                    <input
                      type="date"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-200 focus:bg-white focus:outline-none transition-all text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Review Strategy */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-l-4 border-teal-600 pl-3 uppercase tracking-wider">
                Review Strategy <span className="text-teal-500">*</span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[
                  { value: "single-blind", desc: "Reviewers know authors, but not vice-versa." },
                  { value: "double-blind", desc: "Both parties remain anonymous during review." },
                  { value: "no-blind", desc: "Both parties know each other's identities." },
                ].map(({ value, desc }) => (
                  <label
                    key={value}
                    className={`relative flex p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 ${formData.mode === value ? "border-teal-600 bg-teal-50" : "border-gray-100 hover:border-gray-200"
                      }`}
                  >
                    <input
                      type="radio"
                      name="mode"
                      value={value}
                      checked={formData.mode === value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold uppercase tracking-wider ${formData.mode === value ? "text-teal-700" : "text-gray-900"}`}>
                        {value.replace("-", " ")}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">{desc}</span>
                    </div>
                    {formData.mode === value && (
                      <div className="absolute top-4 right-4 text-teal-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Research Scope */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-l-4 border-teal-600 pl-3 uppercase tracking-wider">
                Research Scope
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Primary Area</label>
                  <input
                    type="text"
                    name="primaryArea"
                    value={formData.primaryArea}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-200 focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="e.g. Artificial Intelligence"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Expertise Required (comma-separated) <span className="text-teal-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="expertise"
                    value={formData.expertise.join(", ")}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-200 focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="e.g. AI, ML, NLP"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.topics.map((topic, index) => (
                  <div key={index} className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Topic {index + 1}</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => handleTopicChange(index, e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-200 focus:bg-white focus:outline-none transition-all text-sm"
                      placeholder={`Topic ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormData(initialFormData)}
                className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-10 py-3 text-sm text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-teal-900/20"
                style={{ backgroundColor: "#4B707A" }}
              >
                Create Conference
              </button>
            </div>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminConferenceCreationForm;