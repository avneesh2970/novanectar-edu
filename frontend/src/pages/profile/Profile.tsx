/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { updateProfile } from "../../api/services";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<
    "profile" | "enrolled-courses" | "enrolled-internships"
  >("profile");
  const { logout, getUser } = useAuth();
  const [userInfo, setUserInfo] = useState<any>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    enrollments: [],
  });
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
                <ul>
                  {userInfo.enrollments
                    .filter((e: any) => e.type === "course")
                    .map((enrollment: any, index: number) => (
                      <li key={index} className="mb-2">
                        Course ID: {enrollment.item}
                      </li>
                    ))}
                </ul>
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
                <ul>
                  {userInfo.enrollments
                    .filter((e: any) => e.type === "internship")
                    .map((enrollment: any, index: number) => (
                      <li key={index} className="mb-2">
                        Internship ID: {enrollment.item}
                      </li>
                    ))}
                </ul>
              ) : (
                <p>You are not enrolled in any internships yet.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
