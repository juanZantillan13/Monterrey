import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Colonia() {
  const { municipioId, zonaId, coloniaId } = useParams();
  const navigate = useNavigate();

  // Estados para almacenar los datos reales de Firebase
  const [nombreMuni, setNombreMuni] = useState("");
  const [nombreZona, setNombreZona] = useState("");
  const [colonia, setColonia] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Tu URL de Firebase (sin la barra "/" al final)
  const DB_URL = "https://agua-mty-default-rtdb.firebaseio.com";

  useEffect(() => {
    async function cargarDatosFinales() {
      try {
        setCargando(true);

        // 1. Traer los datos de la colonia específica (Ruta limpia sin carpetas dobles)
        const responseCol = await fetch(
          `${DB_URL}/municipios/${municipioId}/zonas/${zonaId}/colonias/${coloniaId}.json`
        );
        const colData = await responseCol.json();

        // 2. Traer el nombre del municipio para los subtítulos
        const responseMuni = await fetch(`${DB_URL}/municipios/${municipioId}/nombre.json`);
        const muniName = await responseMuni.json();

        // 3. Traer el nombre de la zona para los subtítulos
        const responseZona = await fetch(
          `${DB_URL}/municipios/${municipioId}/zonas/${zonaId}/nombre.json`
        );
        const zonaName = await responseZona.json();

        if (colData) setColonia(colData);
        if (muniName) setNombreMuni(muniName);
        if (zonaName) setNombreZona(zonaName); 

      } catch (error) {
        console.error("Error al consultar el estatus en Firebase:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatosFinales();
  }, [municipioId, zonaId, coloniaId]);

  if (cargando) {
    return <div className="page"><p>Verificando estatus del agua...</p></div>;
  }

  if (!colonia) {
    return (
      <div className="page">
        <h2>Colonia no encontrada</h2>
        <button className="card" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="page">

      <h1>{colonia.nombre}</h1>
      <p className="subtitle">
        {nombreMuni} &mdash; {nombreZona}
      </p>

      {colonia.tiene_agua === false ? (
        <div className="schedule-card" style={{ borderColor: "#b71c1c", background: "#ffcdd2" }}>
          <div className="schedule-item" style={{ textAlign: "center", display: "block" }}>
            <h3 style={{ color: "#b71c1c", margin: "0 0 10px 0" }}>⚠️ CORTE DE AGUA RESTRINGIDO</h3>
            <p style={{ color: "#555", margin: 0 }}>
              Este sector se encuentra actualmente sin servicio o presenta baja presión severa.
            </p>
          </div>
        </div>
      ) : (
        <div className="schedule-card no-schedule" style={{ borderColor: "#1b5e20", background: "#c8e6c9" }}>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ color: "#1b5e20", margin: "0 0 10px 0" }}>💧 SERVICIO NORMAL</h3>
            <p style={{ color: "#555", margin: 0 }}>
              El suministro de agua opera de forma regular en esta colonia.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}