import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Project from "./pages/Project"
import './App.css';

function App() {
  return (
    <>
      <BrowserRouter basename="/company-activators">
        <Routes>
          <Route index element={<Home />} />
          <Route path="project/:id" element={<Project />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
