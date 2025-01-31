import OurCourses from "../components/OurCourses";
import Landing from "../components/Landing";
import SpecialProgramme from "../components/SpecialProgramme";
import Testimonials from "../components/Testimonials";
import GetPlacement from "../components/GetPlacement";
import Footer from "../components/Footer";
import StudentJourney from "../components/student-journey/Journey";
import CallingIcon from "../components/socialContact/Call";
import WhatsappIcon from "../components/socialContact/Whatsapp";

const Home = () => {
  return (
    <>
      <Landing />

      {/* our coueces */}
      <OurCourses />

      {/* Special Programme Section */}
      <SpecialProgramme />

      {/* students journey  */}
      <StudentJourney />

      {/* testimonial  */}
      <Testimonials />

      {/* get placement  */}
      <GetPlacement />

      {/* Footer Section */}
      <Footer />

      {/* call icons */}
      <CallingIcon />
      <WhatsappIcon />
    </>
  );
};

export default Home;
