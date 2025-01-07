import { placementAssistentCards } from "../data/courses";

export default function GetPlacement() {
  return (
       <div className="bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-blue-800 mb-8">
            Get Placement Assistance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {placementAssistentCards.map((card, index) => (
              <div
                key={index}
                className="bg-white border border-blue-800 rounded-lg p-6 shadow-md hover:shadow-blue-800 hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-blue-600 text-4xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div> 
  )
}
