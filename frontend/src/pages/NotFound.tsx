// src/pages/NotFound.tsx
const NotFound = () => {
  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center">
      <div className="text-center">
        {/* Animated 404 Heading */}
        <h1 className="text-9xl font-bold text-white animate-bounce">404</h1>
        {/* Subtitle */}
        <p className="text-2xl text-white mt-4 animate-fade-in-down">
          Oops! Page Not Found
        </p>
        {/* Description */}
        <p className="text-white mt-2 text-lg animate-fade-in-up">
          The page you're looking for doesn't exist or has been moved.
        </p>
        {/* Home Button */}
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 px-6 py-3 bg-white text-green-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 animate-fade-in-up"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
