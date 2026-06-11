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
  return (
    <div className="page" style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "50vh",
      paddingBottom: "40px"
    }}>
      <div style={{ 
        textAlign: "center",
        padding: "40px",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>
        <p style={{ fontSize: "1.2rem", color: "#2f2cc9" }}>⏳ Verificando estatus del agua...</p>
      </div>
    </div>
  );
}

if (!colonia) {
  return (
    <div className="page" style={{ paddingBottom: "40px" }}>
      <div style={{ 
        maxWidth: "500px", 
        margin: "40px auto", 
        textAlign: "center",
        padding: "40px",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0"
      }}>
        <h2 style={{ color: "#2f2cc9", marginBottom: "20px" }}>🔍 Colonia no encontrada</h2>
        <button 
          className="card" 
          onClick={() => navigate("/")}
          style={{
            background: "#2f2cc9",
            color: "white",
            border: "none",
            padding: "12px 25px",
            borderRadius: "50px",
            fontSize: "1rem",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#4f8fd9";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#2f2cc9";
            e.target.style.transform = "translateY(0)";
          }}
        >
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}

return (
  <div className="page" style={{ paddingBottom: "40px" }}>
    {/* Encabezado con gradiente */}
    <div style={{ 
      background: "linear-gradient(135deg, #2f2cc9 0%, #4f8fd9 100%)", 
      borderRadius: "20px", 
      padding: "30px 20px", 
      marginBottom: "30px",
      color: "white",
      textAlign: "center",
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ margin: "0 0 10px 0", fontSize: "2rem", color: "white" }}>
        {colonia.nombre}
      </h1>
      <p className="subtitle" style={{ margin: 0, fontSize: "1rem", opacity: 0.9, color: "white" }}>
        {nombreMuni} &mdash; {nombreZona}
      </p>
    </div>

    {/* Tarjeta de estado del agua */}
    {colonia.tiene_agua === false ? (
      <div style={{ 
        maxWidth: "600px", 
        margin: "20px auto",
        border: "2px solid #b71c1c", 
        background: "#ffcdd2",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 8px 20px rgba(183,28,28,0.15)",
        textAlign: "center"
      }}>
        <div style={{ textAlign: "center", display: "block" }}>
          <h3 style={{ color: "#b71c1c", margin: "0 0 15px 0", fontSize: "1.5rem" }}>
            ⚠️ CORTE DE AGUA RESTRINGIDO
          </h3>
          <p style={{ color: "#555", margin: 0, lineHeight: "1.5" }}>
            Este sector se encuentra actualmente sin servicio o presenta baja presión severa.
          </p>
        </div>
      </div>
    ) : (
      <div style={{ 
        maxWidth: "600px", 
        margin: "20px auto",
        border: "2px solid #1b5e20", 
        background: "#c8e6c9",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 8px 20px rgba(27,94,32,0.15)",
        textAlign: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <h3 style={{ color: "#1b5e20", margin: "0 0 15px 0", fontSize: "1.5rem" }}>
            💧 SERVICIO NORMAL
          </h3>
          <p style={{ color: "#555", margin: 0, lineHeight: "1.5" }}>
            El suministro de agua opera de forma regular en esta colonia.
          </p>
        </div>
      </div>
    )}

    </div>
);
}