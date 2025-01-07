import { programs } from "../data/courses";



export default function SpecialProgramme() {
  return (
    <div className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading Section */}
        <h2 className="text-2xl font-semibold text-blue-800 mb-6">
          Choose Our Special Programs
        </h2>
        <p className="text-gray-700 text-sm mb-12">
          Boost your IT career with our professional training programs led by
          industry experts!
        </p>

        {/* Card Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-white rounded-xl hover:shadow-blue-800 shadow-md hover:shadow-sm transition-shadow duration-300 p-8 flex flex-col items-center transform hover:scale-105"
            >
              <h3 className="text-2xl font-medium text-blue-800 mb-3">
                {program.title}
              </h3>
              <h2 className="text-center text-blue-800 mb-3 text-sm font-semibold">
                {program.heading}
              </h2>
              <ul className="text-gray-700 text-sm mb-6 space-y-3 text-left">
                {program.description.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span> {item}
                  </li>
                ))}
              </ul>
              <button className="px-6 py-3 border border-blue-800 text-blue-800 font-medium rounded-lg hover:bg-blue-800 hover:text-white transition-all duration-300">
                {program.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
