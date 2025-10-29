import OurCourses from "../components/OurCourses";
import Landing from "../components/Landing";
import SpecialProgramme from "../components/SpecialProgramme";
import Testimonials from "../components/Testimonials";
import GetPlacement from "../components/GetPlacement";
import Footer from "../components/Footer";
import StudentJourney from "../components/student-journey/Journey";
import CallingIcon from "../components/socialContact/Call";
import WhatsappIcon from "../components/socialContact/Whatsapp";
// import popup1 from "../assets/popup/popup1.webp";
// import AdPopup from "../components/adpopup/AdPopup";
// import { useEffect } from "react";
import Chatbot from "../components/socialContact/Chatbot";

const Home = () => {
  // const [showPopup, setShowPopup] = useState(false);

  // useEffect(() => {
  //   // Check if user has already seen the popup in this session
  //   const hasSeenPopup = sessionStorage.getItem("hasSeenAdPopup");

  //   if (!hasSeenPopup) {
  //     setShowPopup(true);
  //   }
  // }, []);

  // const handleClosePopup = () => {
  //   setShowPopup(false);
  //   // Mark that user has seen the popup in this session
  //   sessionStorage.setItem("hasSeenAdPopup", "true");
  // };

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

      {/* chat bot  */}
      <Chatbot />

      {/* Advertisement Popup - only shows on first visit */}
      {/* {showPopup && <AdPopup imageSrc={popup1} onClose={handleClosePopup} />} */}
    </>
  );
};

export default Home;
