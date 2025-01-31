import { motion } from "framer-motion";
import about from "../../assets/About/about.png";
import Footer from "../Footer";
import CallingIcon from "../socialContact/Call";
import WhatsappIcon from "../socialContact/Whatsapp";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-72 md:h-96 flex flex-col justify-center items-center text-center text-white px-4"
        style={{ backgroundImage: `url(${about})` }}
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          About Us Novanectar
        </h1>
        <p className="max-w-2xl text-sm md:text-lg">
          NovaNectar is a prominent provider of training and solutions, offering
          courses in areas such as UI/UX design, mobile technologies including
          Apple iOS, Google Android, and Windows 8, as well as web development
          technologies like AngularJS, React, HTML5, and CSS3.
        </p>
      </div>

      {/* Vision and Mission Section */}
      <div className="py-16 px-4 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="p-8 border border-blue-300 rounded-lg shadow-md bg-blue-50 hover:bg-blue-100 transition-all"
          >
            <div className="flex items-center space-x-4">
              <span className="text-blue-600 text-4xl">&#128065;</span>
              <h2 className="text-xl md:text-2xl font-semibold text-blue-600">
                Vision
              </h2>
            </div>
            <p className="mt-4 text-gray-600">
              Gain the knowledge and skills needed to advance your career with
              tailored support and top-tier training programs crafted and
              delivered by industry experts.
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="p-8 border border-blue-300 rounded-lg shadow-md bg-blue-50 hover:bg-blue-100 transition-all"
          >
            <div className="flex items-center space-x-4">
              <span className="text-blue-600 text-4xl">&#128187;</span>
              <h2 className="text-xl md:text-2xl font-semibold text-blue-600">
                Mission
              </h2>
            </div>
            <p className="mt-4 text-gray-600">
              "Bridging the employability gap by empowering individuals to
              achieve their technical potential and excel professionally through
              a supportive and highly engaging environment."
            </p>
          </motion.div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50">
        {/* Why Novanectar Section */}
        <div className="py-16 px-4 md:px-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">
            Why Novanectar
          </h2>
          <p className="max-w-4xl mx-auto text-gray-700 text-sm md:text-lg leading-relaxed">
            We focus on providing students with real-world industry exposure by
            familiarizing them with the latest trends and platforms. Our
            training programs utilize modern teaching methods, enabling students
            to not only learn but also apply their knowledge in practical
            scenarios. With a team of industry experts specializing in areas
            like Web Development, Data Analytics, Java Programming, and the
            complete MEAN stack, we ensure you receive top-notch guidance and
            remain ahead in the competitive field.
          </p>
        </div>

        {/* Stats Section */}
        <div className="py-12 px-4 md:px-16 bg-blue-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-semibold text-blue-600">
              Creating impact around the world
            </h3>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
              With our global catalog spanning the latest skills and topics,
              people and organizations everywhere are able to adapt to change
              and thrive.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {/* Stats Cards */}
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h4 className="text-2xl font-bold text-blue-600">75M</h4>
              <p className="text-gray-600">Learners</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h4 className="text-2xl font-bold text-blue-600">75K</h4>
              <p className="text-gray-600">Instructors</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h4 className="text-2xl font-bold text-blue-600">20+</h4>
              <p className="text-gray-600">Courses</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h4 className="text-2xl font-bold text-blue-600">1B+</h4>
              <p className="text-gray-600">Course Enrollments</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h4 className="text-2xl font-bold text-blue-600">75</h4>
              <p className="text-gray-600">Languages</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h4 className="text-2xl font-bold text-blue-600">30+</h4>
              <p className="text-gray-600">Company</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {/* call icons */}
      <CallingIcon />
      <WhatsappIcon />
    </div>
  );
};

export default AboutUs;
