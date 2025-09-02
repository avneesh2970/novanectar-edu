/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { updateProfile } from "../../api/services";
import CallingIcon from "../../components/socialContact/Call";
import WhatsappIcon from "../../components/socialContact/Whatsapp";
import Certificate from "../certificate/Certificate";

// import courseImages from "../../assets/courses/index";
const courseImages: Record<string, { default: string }> = import.meta.glob(
  "../../assets/courses/*.webp",
  { eager: true }
);
const internshipImages: Record<string, { default: string }> = import.meta.glob(
  "../../assets/internships/*.png",
  { eager: true }
);

// import internshipImages from "../../assets/internships/index";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "enrolled-courses"
    | "enrolled-internships"
    | "verify-certificates"
  >("profile");
  const { logout, getUser } = useAuth();
  const [userInfo, setUserInfo] = useState<any>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    enrollments: [],
  });
  // console.log("userInfo: ", userInfo)
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile.submitForm(userInfo);
      setIsEditing(false); //added to stop editing after submit
    } catch (error) {
      console.log("error in update profile: ", error);
    } finally {
      setLoading(false);
    }
  };

  const userData = async () => {
    const userDoc = await getUser();

    setUserInfo({
      firstName: userDoc.firstName || "",
      lastName: userDoc.lastName || "",
      phoneNumber: userDoc.phoneNumber || "",
      email: userDoc.email || "",
      enrollments: userDoc.enrollments || [],
    });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUserInfo((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    userData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUser]);

  const getCourseNumber = (orderType: any, courseName: any) => {
    if (orderType === "course") {
      if (courseName === "MERN Full-Stack Development") return "1";
      else if (courseName === "Frontend Development") return "2";
      else if (courseName == "Data Analytics") return "3";
      else if (courseName == "Java Full Stack Development") return "4";
      else if (courseName == "MEAN Full-Stack Development") return "5";
      else if (courseName == "Graphic Design") return "6";
      else if (courseName == "Full Stack Development") return "7";
      else if (courseName == "React Development") return "8";
      else if (courseName == "Angular Development") return "9";
      else if (courseName == "Data Science") return "10";
      else if (courseName == "Digital Marketing") return "11";
      else if (courseName == "UI UX Designing") return "12";
      else if (courseName == "Machine Learning") return "13";
      else if (courseName == "Artificial Intelligence") return "14";
      else if (courseName == "Advanced Python") return "15";
    } else if (orderType === "internship") {
      if (courseName === "Python Developer") return "1";
      else if (courseName === "C/C++ Programming") return "2";
      else if (courseName === "Graphic Designer") return "3";
      else if (courseName === "Data Analytics") return "4";
      else if (courseName === "Web Developer") return "5";
      else if (courseName === "Artieficial Intlligence") return "6";
      else if (courseName === "Machine Learning") return "7";
      else if (courseName === "Java Developer") return "8";
      else if (courseName === "Full Stack Developer") return "9";
      else if (courseName === "App Development") return "10";
      else if (courseName === "Data Science") return "11";
      else if (courseName === "UI/UX Designer") return "12";
      else if (courseName === "Cybersecurity") return "13";
      else if (courseName === "Digital Marketing") return "14";
      else if (courseName === "Content Writing") return "15";
      else if (courseName === "WordPress") return "16";
      else if (courseName === "Cloud Computing") return "17";
      else if (courseName === "Data Visualization") return "18";
      else if (courseName === "HR") return "19";
      else if (courseName === "Content Creator") return "20";
    }
  };

  return (
    <div className="mt-12 md:mt-20">
      <p className="ml-4 md:ml-6 font-medium pt-10 md:pt-8 text-xl md:text-3xl">
        Profile
      </p>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <div className="mx-4 md:ml-4 md:mr-0 shadow-md border-blue-500 border mt-4 md:mt-12 bg-blue-200 rounded-lg md:rounded-t-2xl">
          <aside className="space-y-2 p-4 w-full md:w-64">
            <div className="hidden md:flex items-center space-x-2 text-gray-600">
              <img
                src="https://cdn-icons-png.flaticon.com/512/9203/9203764.png"
                className="w-10 h-10"
                alt="profile"
              />
              <h2 className="font-semibold">{userInfo.firstName}</h2>
            </div>
            <button
              onClick={() => setActiveTab("profile")}
              className={`font-semibold w-full text-left px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                activeTab === "profile"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("enrolled-courses")}
              className={`font-semibold w-full text-left px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                activeTab === "enrolled-courses"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              Enrolled Courses
            </button>
            <button
              onClick={() => setActiveTab("enrolled-internships")}
              className={`font-semibold w-full text-left px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                activeTab === "enrolled-internships"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              Enrolled Internships
            </button>
            <button
              onClick={() => setActiveTab("verify-certificates")}
              className={`font-semibold w-full text-left px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                activeTab === "verify-certificates"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              Verify Certificates
            </button>
            <button
              className="w-full text-left px-4 py-2 rounded-lg transition-colors text-sm md:text-base hover:text-blue-500 text-gray-700 font-semibold"
              onClick={logout}
            >
              Logout
            </button>
          </aside>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {activeTab === "profile" && (
            <div className="max-w-2xl bg-white rounded-lg shadow-sm p-4 md:p-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                  Profile Settings
                </h1>
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    Edit
                  </button>
                )}
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      className={`w-full text-gray-700 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base ${
                        !isEditing ? "bg-gray-100" : ""
                      }`}
                      placeholder="First name"
                      name="firstName"
                      value={userInfo.firstName}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className={`w-full text-gray-700 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base ${
                        !isEditing ? "bg-gray-100" : ""
                      }`}
                      placeholder="Last name"
                      name="lastName"
                      value={userInfo.lastName}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    className={`w-full text-gray-700 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base ${
                      !isEditing ? "bg-gray-100" : ""
                    }`}
                    placeholder="Mobile number"
                    name="phoneNumber"
                    value={userInfo.phoneNumber}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`w-full text-gray-700 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base ${
                      !isEditing ? "bg-gray-100" : ""
                    }`}
                    placeholder="Email Address"
                    name="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </div>
                {isEditing && (
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      {loading ? "loading..." : "Update Profile"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === "enrolled-courses" && (
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">
                Enrolled Courses
              </h1>
              {userInfo.enrollments.filter((e: any) => e.type === "course")
                .length > 0 ? (
                <div>
                  <div className="min-h-screen bg-gray-50 p-8">
                    <div className="mx-auto max-w-7xl">
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {userInfo.enrollments
                          .filter((e: any) => e.type === "course")

                          .map((enrollment: any, index: number) => (
                            <div
                              key={index}
                              className="group relative h-full overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/40"
                            >
                              <div className="relative h-48 overflow-hidden">
                                <img
                                  src={
                                    courseImages[
                                      `../../assets/courses/course${getCourseNumber(
                                        enrollment.item.orderType,
                                        enrollment.item.courseName
                                      )}.webp`
                                    ]?.default
                                  }
                                  alt={enrollment.item?.courseTitle}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
                              </div>
                              <div className="p-6">
                                <div className="mb-4 flex items-start justify-between">
                                  <h3 className="text-xl font-semibold text-gray-800">
                                    {enrollment.item?.courseTitle}
                                  </h3>
                                  <span className="text-sm text-gray-500">
                                    {new Date(
                                      enrollment.item.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>

                                <p className="text-gray-600 line-clamp-3">
                                  {enrollment.item?.courseDescription}
                                </p>

                                <div className="absolute inset-0 -left-[100%] hidden transition-all duration-500 group-hover:left-0 group-hover:block">
                                  <div className="absolute inset-0 border-2 border-blue-200/30"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>You are not enrolled in any courses yet.</p>
              )}
            </div>
          )}

          {activeTab === "enrolled-internships" && (
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">
                Enrolled Internships
              </h1>
              {userInfo.enrollments.filter((e: any) => e.type === "internship")
                .length > 0 ? (
                <div>
                  <div className="min-h-screen bg-gray-50 p-8">
                    <div className="mx-auto max-w-7xl">
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {userInfo.enrollments
                          .filter((e: any) => e.type === "internship")
                          .map((enrollment: any, index: number) => (
                            <div
                              key={index}
                              className="group relative h-full overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/40"
                            >
                              <div className="relative h-48 overflow-hidden">
                                <img
                                  src={
                                    internshipImages[
                                      `../../assets/internships/intern${getCourseNumber(
                                        enrollment.item.orderType,
                                        enrollment.item.courseName
                                      )}.png`
                                    ]?.default
                                  }
                                  alt={enrollment.item?.courseTitle}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
                              </div>
                              <div className="p-6">
                                <div className="mb-4 flex items-start justify-between">
                                  <h3 className="text-xl font-semibold text-gray-800">
                                    {enrollment.item?.courseTitle}
                                  </h3>
                                  <span className="text-sm text-gray-500">
                                    {new Date(
                                      enrollment.item.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>

                                <p className="text-gray-600 line-clamp-3">
                                  {enrollment.item?.courseDescription}
                                </p>

                                <div className="absolute inset-0 -left-[100%] hidden transition-all duration-500 group-hover:left-0 group-hover:block">
                                  <div className="absolute inset-0 border-2 border-blue-200/30"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>You are not enrolled in any internships yet.</p>
              )}
            </div>
          )}

          {activeTab === "verify-certificates" && <Certificate />}
        </main>
      </div>
      {/* call icons */}
      <CallingIcon />
      <WhatsappIcon />
    </div>
  );
};

export default Profile;
