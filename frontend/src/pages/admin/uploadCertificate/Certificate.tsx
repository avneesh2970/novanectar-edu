"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Upload,
  Calendar,
  Clock,
  User,
  Award,
  Building,
  CheckCircle,
  AlertCircle,
  Camera,
  X,
  Link,
} from "lucide-react";
import toast from "react-hot-toast";

const CertificateForm = () => {
  const [form, setForm] = useState<any>({
    certificateId: "",
    type: "Internship",
    name: "",
    programTitle: "",
    mode: "Offline",
    company: "NovaNectar Services Pvt. Ltd.",
    duration: { months: 0, days: 0 },
    startDate: "",
    endDate: "",
    status: "Active",
  });
  const [file, setFile] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<any>("");
  const [dragActive, setDragActive] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const [message, setMessage] = useState<any>("");

  // Calculate duration automatically based on start and end dates
  const calculateDuration = (startDate: any, endDate: any) => {
    if (!startDate || !endDate) return { months: 0, days: 0 };

    const start: any = new Date(startDate);
    const end: any = new Date(endDate);

    if (end <= start) return { months: 0, days: 0 };

    let months = 0;
    let days = 0;

    const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    months = Math.floor(totalDays / 30);
    days = totalDays % 30;

    return { months, days };
  };

  // Handle normal input change
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    if (name === "startDate" || name === "endDate") {
      const duration = calculateDuration(
        name === "startDate" ? value : form.startDate,
        name === "endDate" ? value : form.endDate
      );
      updatedForm.duration = duration;
    }

    setForm(updatedForm);
  };

  // Handle file upload
  const handleFileChange = (selectedFile: any) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setImageUrl(""); // Clear URL input when file is uploaded
    }
  };

  // Handle URL input change
  const handleUrlChange = (e: any) => {
    const url = e.target.value;
    setImageUrl(url);
    setFile(null); // Clear file when URL is entered
    setPreview(url || null); // Set preview to URL if valid
  };

  // Handle drag events
  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    setImageUrl("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData: any = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "duration") {
          formData.append("durationMonths", String(form.duration.months));
          formData.append("durationDays", String(form.duration.days));
        } else {
          formData.append(key, form[key]);
        }
      });
      if (file) {
        // Must match multer .single("certificateImage")
        formData.append("certificateImage", file);
      } else if (imageUrl) {
        formData.append("certificateImageUrl", imageUrl);
      }

      // Resolve API base from env if available, fall back to relative path
      const API_BASE = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_BASE}/api/admin/upload-certificate`, {
        method: "POST",
        body: formData,
        // Do NOT set Content-Type when sending FormData; the browser sets the multipart boundary.
        // credentials: "include", // <OPTIONAL> uncomment if your backend uses cookies/session auth
      });

      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        throw new Error(
          (data as any)?.message || `Upload failed with ${res.status}`
        );
      }

      if ((data as any)?.success) {
        setPreview(null);
        setImageUrl("");
        toast.success("Certificate uploaded successfully");
        setMessage("Certificate uploaded successfully");
      } else {
        setMessage("Failed to upload certificate");
      }
    } catch (error: any) {
      console.log("[v0] Upload error:", error?.message || error);
      setMessage("Error uploading certificate");
    } finally {
      setLoading(false);
      setForm({
        certificateId: "",
        type: "Internship",
        name: "",
        programTitle: "",
        mode: "Offline",
        company: "NovaNectar Services Pvt. Ltd.",
        duration: { months: 0, days: 0 },
        startDate: "",
        endDate: "",
        status: "Active",
      });
    }
  };

  const formatDuration = () => {
    const { months, days } = form.duration;
    if (months === 0 && days === 0) return "No duration calculated";
    if (months === 0) return `${days} day${days !== 1 ? "s" : ""}`;
    if (days === 0) return `${months} month${months !== 1 ? "s" : ""}`;
    return `${months} month${months !== 1 ? "s" : ""} & ${days} day${
      days !== 1 ? "s" : ""
    }`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Upload Certificate
          </h1>
          <p className="text-gray-600">Add a new certificate to the system</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white shadow-xl rounded-3xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Certificate ID & Type */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <Award className="w-4 h-4 mr-2 text-blue-600" />
                    Certificate ID
                  </label>
                  <div className="relative">
                    <input
                      name="certificateId"
                      placeholder="e.g. NN/IN/01/1000"
                      value={form.certificateId}
                      onChange={handleChange}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      required
                    />
                    <Award className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                    Certificate Type
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 bg-white appearance-none"
                    >
                      <option value="Internship">🎓 Internship</option>
                      <option value="Training">📚 Training</option>
                    </select>
                    <CheckCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Student Name & Program Title */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <User className="w-4 h-4 mr-2 text-emerald-600" />
                    Student Name
                  </label>
                  <div className="relative">
                    <input
                      name="name"
                      placeholder="Enter student full name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      required
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <Building className="w-4 h-4 mr-2 text-emerald-600" />
                    Program Title
                  </label>
                  <div className="relative">
                    <input
                      name="programTitle"
                      placeholder="e.g. MERN Stack Development"
                      value={form.programTitle}
                      onChange={handleChange}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      required
                    />
                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Mode & Company */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                    Mode
                  </label>
                  <div className="relative">
                    <select
                      name="mode"
                      value={form.mode}
                      onChange={handleChange}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-gray-900 bg-white appearance-none"
                    >
                      <option value="Offline">🏢 Offline</option>
                      <option value="Online">💻 Online</option>
                      <option value="Hybrid">🔄 Hybrid</option>
                    </select>
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <Building className="w-4 h-4 mr-2 text-orange-600" />
                    Company
                  </label>
                  <div className="relative">
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-gray-900 bg-gray-50"
                      readOnly
                    />
                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <Calendar className="w-4 h-4 mr-2 text-green-600" />
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-gray-900"
                      required
                    />
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <Calendar className="w-4 h-4 mr-2 text-red-600" />
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-900"
                      required
                    />
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-400" />
                  </div>
                </div>
              </div>

              {/* Auto-calculated Duration Display */}
              {(form.startDate || form.endDate) && (
                <div className="space-y-4">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <Clock className="w-4 h-4 mr-2 text-indigo-600" />
                    Calculated Duration
                  </label>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-100">
                    <div className="flex items-center justify-center">
                      <div className="bg-white p-4 rounded-xl border-2 border-indigo-200 shadow-sm">
                        <div className="flex items-center justify-center space-x-3">
                          <Clock className="w-6 h-6 text-indigo-600" />
                          <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600">
                              {formatDuration()}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {form.startDate && form.endDate
                                ? "Automatically calculated from dates"
                                : "Please select both start and end dates"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {form.startDate &&
                      form.endDate &&
                      new Date(form.endDate) <= new Date(form.startDate) && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center">
                          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                          <span className="text-red-700 text-sm font-medium">
                            End date must be after start date
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Enhanced File Upload or URL Input */}
              <div className="space-y-4">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <Camera className="w-4 h-4 mr-2 text-purple-600" />
                  Certificate Image
                </label>

                <div className="space-y-4">
                  {/* URL Input */}
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="Enter image URL (e.g., https://example.com/certificate.jpg)"
                      value={imageUrl}
                      onChange={handleUrlChange}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      disabled={!!file} // Disable URL input if file is uploaded
                    />
                    <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                  </div>

                  {/* File Upload */}
                  {!imageUrl && (
                    <div
                      className={`relative border-3 border-dashed rounded-2xl transition-all duration-300 cursor-pointer group overflow-hidden ${
                        dragActive
                          ? "border-purple-500 bg-purple-50 scale-105 shadow-lg"
                          : "border-gray-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-25 hover:to-pink-25"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("file-input")?.click()
                      }
                    >
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files && handleFileChange(e.target.files[0])
                        }
                        className="hidden"
                        disabled={!!imageUrl} // Disable file input if URL is entered
                      />

                      <div className="p-8 sm:p-12 text-center relative">
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute top-4 left-4 w-8 h-8 bg-purple-400 rounded-full animate-pulse"></div>
                          <div className="absolute bottom-4 right-4 w-6 h-6 bg-pink-400 rounded-full animate-pulse delay-1000"></div>
                          <div className="absolute top-1/2 left-8 w-4 h-4 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                        </div>

                        <div
                          className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-300 ${
                            dragActive
                              ? "bg-purple-600 scale-110 shadow-xl"
                              : "bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-110 group-hover:shadow-xl"
                          }`}
                        >
                          <Upload
                            className={`w-10 h-10 text-white transition-transform duration-300 ${
                              dragActive ? "animate-bounce" : ""
                            }`}
                          />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {dragActive
                            ? "Drop your image here!"
                            : "Upload Certificate Image"}
                        </h3>

                        <p className="text-gray-600 mb-6">
                          Drag and drop your image here, or{" "}
                          <span className="text-purple-600 font-semibold underline decoration-purple-300">
                            click to browse
                          </span>
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 text-xs">
                          <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-2 rounded-full font-medium border border-purple-200">
                            PNG
                          </span>
                          <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-2 rounded-full font-medium border border-purple-200">
                            JPG
                          </span>
                          <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-2 rounded-full font-medium border border-purple-200">
                            JPEG
                          </span>
                          <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-2 rounded-full font-medium border border-gray-300">
                            Max 10MB
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Preview */}
                  {preview && (
                    <div className="relative bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200 shadow-sm">
                      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                          <div className="relative group">
                            <img
                              src={preview || "/placeholder.svg"}
                              alt="Certificate preview"
                              className="w-40 h-40 sm:w-48 sm:h-32 object-cover rounded-xl shadow-lg border-4 border-white group-hover:shadow-xl transition-all duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-300"></div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900 truncate mb-2 sm:mb-0">
                              📄 {file ? file.name : "Image from URL"}
                            </h4>
                            <button
                              type="button"
                              onClick={removeImage}
                              className="mx-auto sm:mx-0 p-2 text-red-500 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="space-y-3">
                            <p className="text-sm text-gray-600">
                              📊 Source:{" "}
                              <span className="font-semibold">
                                {file
                                  ? `File (${(file.size / 1024 / 1024).toFixed(
                                      2
                                    )} MB)`
                                  : "URL"}
                              </span>
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                if (file) {
                                  document
                                    .getElementById("file-input")
                                    ?.click();
                                } else {
                                  setImageUrl("");
                                  setPreview(null);
                                }
                              }}
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {file ? "Change Image" : "Enter New URL"}
                            </button>
                          </div>
                          {file && (
                            <input
                              id="file-input"
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                e.target.files &&
                                handleFileChange(e.target.files[0])
                              }
                              className="hidden"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <AlertCircle className="w-4 h-4 mr-2 text-amber-600" />
                  Certificate Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 text-gray-900 bg-white appearance-none"
                  >
                    <option value="Active">
                      ✅ Active - Certificate is valid
                    </option>
                    <option value="Revoked">
                      ❌ Revoked - Certificate is invalid
                    </option>
                  </select>
                  <AlertCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8">
                <button
                  type="submit"
                  disabled={
                    loading ||
                    (!file && !imageUrl) ||
                    !form.certificateId ||
                    !form.name ||
                    !form.programTitle ||
                    !form.startDate ||
                    !form.endDate
                  }
                  className={`w-full py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform relative overflow-hidden ${
                    loading ||
                    (!file && !imageUrl) ||
                    !form.certificateId ||
                    !form.name ||
                    !form.programTitle ||
                    !form.startDate ||
                    !form.endDate
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-2xl text-white"
                  }`}
                >
                  {!loading &&
                    (file || imageUrl) &&
                    form.certificateId &&
                    form.name &&
                    form.programTitle && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                    )}

                  <div className="relative z-10">
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-3 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                        <span>Uploading Certificate...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Upload className="w-6 h-6 mr-3" />
                        <span>Upload Certificate</span>
                      </div>
                    )}
                  </div>
                </button>

                {((!file && !imageUrl) ||
                  !form.certificateId ||
                  !form.name ||
                  !form.programTitle ||
                  !form.startDate ||
                  !form.endDate) && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium mb-2">
                          Please complete the following required fields:
                        </p>
                        <ul className="space-y-1 text-xs">
                          {!form.certificateId && <li>• Certificate ID</li>}
                          {!form.name && <li>• Student Name</li>}
                          {!form.programTitle && <li>• Program Title</li>}
                          {!form.startDate && <li>• Start Date</li>}
                          {!form.endDate && <li>• End Date</li>}
                          {!file && !imageUrl && (
                            <li>• Certificate Image or URL</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* Success/Error Message */}
            {message && (
              <div
                className={`mt-8 p-6 rounded-2xl border-2 shadow-lg ${
                  message.includes("successfully")
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                    : "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
                }`}
              >
                <div className="flex items-center justify-center">
                  {message.includes("successfully") ? (
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                        <CheckCircle className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <span className="text-green-800 font-bold text-xl">
                          Success!
                        </span>
                        <p className="text-green-700 text-sm mt-1">
                          Certificate has been uploaded successfully
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                        <AlertCircle className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <span className="text-red-800 font-bold text-xl">
                          Error!
                        </span>
                        <p className="text-red-700 text-sm mt-1">
                          Please try uploading again
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
            Form Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="font-semibold text-blue-800 mb-1">
                Certificate ID
              </div>
              <div className="text-gray-700 font-medium">
                {form.certificateId || "Not entered"}
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
              <div className="font-semibold text-emerald-800 mb-1">
                Student Name
              </div>
              <div className="text-gray-700 font-medium">
                {form.name || "Not entered"}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="font-semibold text-purple-800 mb-1">Duration</div>
              <div className="text-gray-700 font-medium">
                {formatDuration()}
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
              <div className="font-semibold text-amber-800 mb-1">Status</div>
              <div className="text-gray-700 font-medium">{form.status}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateForm;
