import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { useAppDispatch } from "./store/hooks";
import { restoreSession, loadAuthFromStorage } from "./store/auth/authSlice";

function App() {
  const dispatch = useAppDispatch();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const authData = loadAuthFromStorage();

    if (authData) {
      dispatch(
        restoreSession({
          token: authData.token,
          refreshToken: authData.refreshToken,
          user: authData.user,
        })
      );
    }

    setIsRestoring(false);
  }, []);
  if (isRestoring) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
