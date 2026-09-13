import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./index.css";

import { AnalyseProvider } from "./hooks/AnalyseContext";

import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";

import Dashboard from "./pages/dashboard";
import Profil from "./pages/profil";
import Question1 from "./pages/question1";
import Question2 from "./pages/question2";
import Question3 from "./pages/question3";
import Question4 from "./pages/question4";

import Historique from "./pages/historique";
import AnalyseEnCours from "./pages/analyse";
import CentresDeSante from "./pages/centreSante";
import Localisation from "./pages/localisation";

import DashboardLayout from "./components/DashboardLayout";

import Rapport from "./components/Rapport";
import RapportDentalisPDF from "./components/RapportDentalisPDF";

import Chat from "./pages/chat";

import APropos from "./pages/apropos";
import Fonctionnalites from "./pages/fonctionnalites";
import Contact from "./pages/contact";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================================================== */}
        {/* ROUTES PUBLIQUES */}
        {/* ================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/a-propos"
          element={<APropos />}
        />

        <Route
          path="/fonctionnalites"
          element={<Fonctionnalites />}
        />

        <Route
          path="/centreSante"
          element={<CentresDeSante />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* ================================================== */}
        {/* AUTHENTIFICATION */}
        {/* ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* ================================================== */}
        {/* ESPACE UTILISATEUR */}
        {/* ================================================== */}

        <Route
          element={
            <AnalyseProvider>
              <DashboardLayout />
            </AnalyseProvider>
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/historique"
            element={<Historique />}
          />

          <Route
            path="/profil"
            element={<Profil />}
          />

          <Route
            path="/chat"
            element={<Chat />}
          />

          <Route
            path="/question1"
            element={<Question1 />}
          />

          <Route
            path="/question2"
            element={<Question2 />}
          />

          <Route
            path="/question3"
            element={<Question3 />}
          />

          <Route
            path="/question4"
            element={<Question4 />}
          />

          <Route
            path="/rapport"
            element={<Rapport />}
          />

          <Route
            path="/RapportDentalisPDF"
            element={<RapportDentalisPDF />}
          />

          <Route
            path="/localisation"
            element={<Localisation />}
          />

          <Route
            path="/analyseencours"
            element={<AnalyseEnCours />}
          />

          <Route
            path="/centresdeSante"
            element={<CentresDeSante />}
          />

        </Route>


        {/* ================================================== */}
        {/* ROUTE INCONNUE */}
        {/* ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;