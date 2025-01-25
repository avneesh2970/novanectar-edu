import LoginForm from "./Login-form";
import mainImage from "../../assets/auth/mainImage.png"

export default function Login() {
  return (
    <main className="min-h-screen w-full relative bg-white overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-50 bg-cover bg-center"
      />

      {/* Content Container */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Form Section */}
          <div className="w-full max-w-md mx-auto">
            <LoginForm />
          </div>

          {/* Image Section */}
          <div className="hidden lg:block">
            <div
              className="relative w-full aspect-square"
            >
              <img
                src={mainImage}
                alt="Knowledge is power illustration"
                className="w-full h-full object-contain animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
