import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./components/AppLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Upload from "./pages/Upload";
import NoteDetail from "./pages/NoteDetail";
import AISearch from "./pages/AISearch";
import Graph from "./pages/Graph";
import AIChat from "./pages/AIChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />


        {/* Application pages */}

        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />

        <Route
          path="/notes"
          element={
            <AppLayout>
              <Notes />
            </AppLayout>
          }
        />

        <Route
          path="/upload"
          element={
            <AppLayout>
              <Upload />
            </AppLayout>
          }
        />
        <Route
          path="/notes/:id"
          element={
            <AppLayout>
              <NoteDetail />
            </AppLayout>
          }
        />
        <Route
          path="/ai-search"
          element={
            <AppLayout>
              <AISearch />
            </AppLayout>
          }
        />
        <Route
          path="/graph"
          element={
            <AppLayout>
              <Graph />
            </AppLayout>
          }
        />
        <Route
          path="/ai-chat"
          element={
            <AppLayout>
              <AIChat />
            </AppLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;