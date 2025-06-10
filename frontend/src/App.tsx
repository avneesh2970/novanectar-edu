import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./store/AuthStore";
import TrackPageViews from "./TrackPageViews";

function App() {

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <TrackPageViews router={router} />
    </AuthProvider>
  );
}

export default App;
