import Footer from "../components/Footer";
import OurCourses from "../components/OurCourses";
import CallingIcon from "../components/socialContact/Call";
import WhatsappIcon from "../components/socialContact/Whatsapp";

export default function Courses() {
  return (
    <div>
      <OurCourses />
      <Footer />
          {/* call icons */}
          <CallingIcon />
      <WhatsappIcon />
    </div>
  );
}
