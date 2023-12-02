import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Home, Login, Profile, Register, ResetPassword } from "./pages";
import { useSelector } from "react-redux";

function RequireUser() {
  const { user } = useSelector((state) => state.user);

  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

function OnlyIfLoggedIn() {
  const { user } = useSelector((state) => state.user);

  const location = useLocation();

  return user?.token ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
}

function App() {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <Routes>
        <Route element={<RequireUser />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id?" element={<Profile />} />
        </Route>

        <Route element={<OnlyIfLoggedIn />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
