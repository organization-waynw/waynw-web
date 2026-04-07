import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import PersonaDetailPage from "./pages/PersonaDetailPage";
import EpisodeDetailpage from "./pages/EpisodeDetailpage";
import EpisodeCreatepage from "./pages/EpisodeCreatepage";

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
