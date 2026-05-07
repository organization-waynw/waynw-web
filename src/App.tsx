import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signupPage";
import MainPage from "./pages/mainPage";
import PersonaDetailPage from "./pages/personaDetailPage";
import EpisodeDetailpage from "./pages/episodeDetailpage";
import EpisodeCreatepage from "./pages/episodeCreatepage";
import PersonaCreateStep2 from "./pages/personaCreateStep2";
import PersonaCreateStep1 from "./pages/personaCreateStep1";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} />

        <Route path="/persona/:id" element={<PersonaDetailPage />} />
        <Route
          path="/persona/:id/episode/create"
          element={<EpisodeCreatepage />}
        />
        <Route
          path="/persona/:id/episode/:episodeId"
          element={<EpisodeDetailpage />}
        />

        <Route path="/persona/create" element={<PersonaCreateStep1 />} />
        <Route path="/persona/create/step2" element={<PersonaCreateStep2 />} />

        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>

      <Toaster
        position="top-center"
        gutter={8}
        containerStyle={{ top: 20, right: 20 }}
        toastOptions={{
          duration: 1000,
          style: {
            background: "#fff",
            color: "#111",
            border: "1px solid #e5e7eb",
            padding: "12px 16px",
            fontSize: "14px",
          },
          success: {
            duration: 1000,
          },
          error: {
            duration: 1000,
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
