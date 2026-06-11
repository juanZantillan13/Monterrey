import { Routes, Route } from "react-router-dom";
import Breadcrumbs from "./components/Breadcrumbs";
import Inicio from "./pages/Inicio";
import Municipio from "./pages/Municipio";
import Zona from "./pages/Zona";
import Colonia from "./pages/Colonia";
import Admin from "./pages/Admin"; 

export default function App() {
  return (
    <div className="app-container">
      <Breadcrumbs />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/municipio/:municipioId" element={<Municipio />} />
          <Route
            path="/municipio/:municipioId/zona/:zonaId"
            element={<Zona />}
          />
          <Route
            path="/municipio/:municipioId/zona/:zonaId/colonia/:coloniaId"
            element={<Colonia />}
          />
          {/* ─── 2. NUEVA RUTA PARA ADMINISTRADORES ─── */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}
