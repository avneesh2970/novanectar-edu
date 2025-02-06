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
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{card.title}</h2>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">
                      Duration: {card.duration}
                    </span>
                  </p>
                  {/* <p className="text-gray-600 text-sm">
                    <span className="font-medium">
                      regular price: {card.regularPrice}
                    </span>
                  </p> */}
                  <p>
                    <span className="font-medium text-gray-600">
                      Regular price: <del>{card.regularPrice} Rs</del>
                    </span>
                  </p>

                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">price: {card.price} Rs</span>
                  </p>
                  <a
                    href="#"
                    className="text-blue-500 text-sm mt-2 inline-block hover:underline"
                  >
                    Learn More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
