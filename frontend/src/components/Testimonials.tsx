import { testimonials } from "../data/courses";

export default function Testimonials() {
  return (
    <div className="pb-12">
      <div className="mx-auto text-center">
        <h2 className="text-2xl font-semibold text-black mb-4">
          What Our Student Say
        </h2>
        <div className="bg-white py-10 overflow-hidden">
          <div className="relative flex items-center">
            <div className="flex animate-scroll whitespace-nowrap">
              {testimonials.concat(testimonials).map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-white rounded-2xl w-96 sm:w-96 mx-4 flex flex-col shadow-lg shadow-blue-300 min-h-[300px] border border-blue-200 pt-4 overflow-hidden"
                >
                  {/* Header section with image and company info */}
                  <div className="flex items-start p-4 gap-4 justify-center">
                    {/* <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full"
                /> */}
                    <div className="flex flex-col justify-center">
                      <p className="text-gray-900 font-medium">
                        {testimonial.company}
                      </p>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Feedback section with proper wrapping */}
                  <div className="px-4 py-2 flex-grow">
                    <p className="text-gray-600 text-sm whitespace-normal break-words">
                      {testimonial.feedback}
                    </p>
                  </div>

                  {/* Name section with blue background */}
                  <div className="mt-auto">
                    <h3 className="bg-blue-700 w-full text-lg font-semibold text-white text-center py-2 px-4">
                      {testimonial.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
