import { useState } from "react";
import { coursesCards } from "../data/courses";
import { useNavigate } from "react-router-dom";

export default function OurCourses() {
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();
  let filteredCards;

  if (activeTab) {
    filteredCards = coursesCards.filter((card) => card.category === activeTab);
  } else {
    filteredCards = coursesCards;
  }

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  // const handleBack = () => {
  //   setSelectedCard(null);
  // };

  return (
    <>
      <div className="text-center py-6">
        <h1 className="text-3xl font-semibold">Courses We Offer</h1>
      </div>

      <div className="min-h-screen bg-white p-4 mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-full ${
                activeTab === "Trending"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("Trending")}
            >
              Trending
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-full ${
                activeTab === "Technology"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("Technology")}
            >
              Technology
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-full text-gray-700 ${
                activeTab === ""
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("")}
            >
              All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCourseClick(card.id)}
                className="bg-white shadow-lg shadow-blue-200 rounded-lg overflow-hidden transition-transform transform hover:scale-105"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-52 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                    {card.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-2">
                    <span className="font-medium">{card.duration}</span>
                  </p>
                  <p className="text-gray-900 text-base mb-5 font-">
                    {card.description}
                  </p>
                  {/* <p>
                    <span className="font-medium text-xl">Rs.{card.price}</span>
                    <span className="font-medium text-red-500 text-sm">
                      Rs.<del>{card.regularPrice}</del>
                    </span>
                    <button className="border border-blue-500 text-blue-500 rounded-md">VIEW DETAILS</button>
                  </p> */}
                  <p className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-semibold">Rs.{card.price}</span>
                      <span className="text-sm font-semibold text-red-500 line-through">
                      Rs.{card.regularPrice}
                      </span>
                    </div>
                    <button className="px-4 py-1.5 text-sm text-blue-600 border-2 border-blue-600 rounded hover:bg-blue-50 transition-colors font-semibold">
                      VIEW DETAILS
                    </button>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
