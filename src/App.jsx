import { Routes, Route } from "react-router-dom";
import Apresentacao from "./pages/homePage/Apresentacao";
import LoginPage from "./pages/loginPage/LoginPage";
import RegisterPage from "./pages/registerPage/RegisterPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Apresentacao />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;