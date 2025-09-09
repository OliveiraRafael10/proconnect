import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import LoginPage from "./pages/loginPage/LoginPage";
import RegisterPage from "./pages/registerPage/RegisterPage";
import EmailVerificationPage from "./pages/emailVerification/EmailVerificationPage";
import EmailVerificationSentPage from "./pages/emailVerification/EmailVerificationSentPage";
import OnboardingPage from "./pages/onboarding/OnboardingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import InicioPage from "./pages/dashboard/InicioPage";
import PerfilPage from "./pages/dashboard/PerfilPage";
import ProfissionaisPage from "./pages/dashboard/ProfissionaisPage";
import MensagensPage from "./pages/dashboard/MensagensPage";
import PublicarServicoPage from "./pages/dashboard/PublicarServicoPage";
import ConfiguracoesPage from "./pages/dashboard/ConfiguracoesPage";
import PrivateRoute from "./routes/PrivateRoute";
import { ROUTES } from "./routes/ROUTES";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationContainer from "./components/ui/NotificationContainer";

function App() {
  return (
    <NotificationProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={ROUTES.LOGINPAGE} element={<LoginPage />} />
        <Route path={ROUTES.REGISTERPAGE} element={<RegisterPage />} />
        <Route path={ROUTES.EMAIL_VERIFICATION} element={<EmailVerificationPage />} />
        <Route path={ROUTES.EMAIL_VERIFICATION_SENT} element={<EmailVerificationSentPage />} />
        <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />
        
        <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
        >
          <Route path="inicio" element={<InicioPage />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="profissionais" element={<ProfissionaisPage />} />
          <Route path="mensagens" element={<MensagensPage />} />
          <Route path="publicar" element={<PublicarServicoPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
        </Route>

      </Routes>
      <NotificationContainer />
    </NotificationProvider>
  );
}

export default App;