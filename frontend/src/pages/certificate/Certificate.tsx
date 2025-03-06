import type React from "react";
import certificatePreview from "../../assets/certificate/preview.png";
import toast from "react-hot-toast";
import { useState } from "react";
import { generateCertificate } from "../../api/services";
import { useNavigate } from "react-router-dom";

const Certificate: React.FC = () => {
  const navigate = useNavigate();
  const [uniqueId, setUniqueId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateCertificate = async () => {
    if (uniqueId.trim() === "") {
      toast.error("please provide your unique enrollment id");
      return;
    }
    setIsLoading(true);
    try {
      const data = await generateCertificate.submitForm(uniqueId);
      console.log("data api response: ", data);
      // Encode the ID for URL safety
      const encodedId = encodeURIComponent(uniqueId);
      // Redirect to the ID page using React Router
      navigate(`/certificate/${encodedId}`);
    } catch (error) {
      console.log("error in getting certificate:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-6 bg-slate-50 min-h-screen">
      {/* Certificate Image */}
      <div className="max-w-md shadow-lg rounded-lg overflow-hidden">
        <img
          src={certificatePreview}
          alt="Certificate of Completion for Shikha Yadav"
          className="w-full h-auto"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <input
          type="text"
          className="p-2 rounded-md bg-white border border-gray-500"
          placeholder="enter your unique id"
          value={uniqueId}
          onChange={(e) => setUniqueId(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md text-lg font-medium transition-colors"
          onClick={handleGenerateCertificate}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Generate Certificate"}
        </button>
      </div>
    </div>
  );
};

export default Certificate;
