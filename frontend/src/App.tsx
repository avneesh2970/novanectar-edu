import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./store/AuthStore";
import TrackPageViews from "./TrackPageViews";
import { initGA } from "./analytics";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    initGA(); // Initialize GA4 once
  }, []);
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <TrackPageViews router={router} />
    </AuthProvider>
  );
}

export default App;
