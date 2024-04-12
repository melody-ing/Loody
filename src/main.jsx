import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Participate from "./pages/Participate/index.jsx";
import Host from "./pages/Host/index.jsx";
import Home from "./pages/Home/index.jsx";
import Game from "./pages/Game/index.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="part" element={<Participate />} />
        <Route path="host" element={<Host />} />

        <Route path="game" element={<Game />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
