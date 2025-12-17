import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import LandingPage from "./pages/public/LandingPage";
import DashboardPage from "./pages/private/DashboardPage";
import { PrivateRoute } from "./routes/PrivateRoute";
import { PublicRoute } from "./routes/PublicRoute";
import AppLayout from "./pages/AppLayout";
import LibraryPage from "./pages/private/LibraryPage";
import GeneratePage from "./pages/private/GeneratePage";
import GeneratePlanPage from "./pages/private/GeneratePlanPage";
import GenerateItemPage from "./pages/private/GenerateItemPage";
import PaymentsPage from "./pages/private/PaymentsPage";
import AccountPage from "./pages/private/AccountPage";
import NotFound from "./pages/public/NotFound";

function App() {
  return (
    <Routes>
      {/* Публичные */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute restricted><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute restricted><RegisterPage /></PublicRoute>} />

      {/* Приватные */}
      <Route path="/dashboard" element={<PrivateRoute><AppLayout><DashboardPage /></AppLayout></PrivateRoute>} />
      <Route path="/library" element={<PrivateRoute><AppLayout><LibraryPage /></AppLayout></PrivateRoute>} />
      <Route path="/payments" element={<PrivateRoute><AppLayout><PaymentsPage /></AppLayout></PrivateRoute>} />
      <Route path="/account" element={<PrivateRoute><AppLayout><AccountPage /></AppLayout></PrivateRoute>} />

      {/* Генерация рефератов */}
      <Route path="/generate" element={<PrivateRoute><AppLayout><GeneratePage /></AppLayout></PrivateRoute>} />
      <Route path="/generate/plan/:essay_id" element={<PrivateRoute><AppLayout><GeneratePlanPage /></AppLayout></PrivateRoute>} />
      <Route path="/generate/item/:essay_id" element={<PrivateRoute><AppLayout><GenerateItemPage /></AppLayout></PrivateRoute>} />

      {/* 404 */}
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
