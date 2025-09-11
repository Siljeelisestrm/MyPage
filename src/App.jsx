import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/game/Game";
import ToDo from "./pages/ToDo";
import RecipesPage from "./pages/RecipesPage";
import GiftPlanner from "./pages/GiftPlanner";
import Layout from "./components/Layout/Layout";
import PinGate from "./components/pingate/PinGate";
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <ToDo />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <Game />
            </Layout>
          }
        />
        <Route
          path="/giftPlanner"
          element={
            <Layout>
              <PinGate requiredPin="2412" storageKey="giftPlannerUnlocked">
                <GiftPlanner />
              </PinGate>
            </Layout>
          }
        />
        <Route
          path="/oppskrifter"
          element={
            <Layout>
              <RecipesPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
