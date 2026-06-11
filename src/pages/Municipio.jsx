import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Municipio() {
  const { municipioId } = useParams();
  const navigate = useNavigate();

  // Estados para guardar los datos reales de Firebase
  const [municipioNombre, setMunicipioNombre] = useState("");
  const [zonas, setZonas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Tu URL real de Firebase (sin la barra "/" al final)
  const DB_URL = "https://agua-mty-default-rtdb.firebaseio.com";

  useEffect(() => {
    async function cargarDatos() {
      try {
        setCargando(true);
        
        // 1. Traer las zonas directamente con la ruta limpia
        const responseZonas = await fetch(`${DB_URL}/municipios/${municipioId}/zonas.json`);
        const zonasData = await responseZonas.json();

        // 2. Traer el nombre legible del municipio
        const responseMuni = await fetch(`${DB_URL}/municipios/${municipioId}/nombre.json`);
        const nombreMuni = await responseMuni.json();

        if (nombreMuni) {
          setMunicipioNombre(nombreMuni);
        }

        // 3. Convertir el objeto de Firebase en un arreglo que React pueda mapear (.map)
        if (zonasData) {
          const arregloZonas = Object.keys(zonasData).map((key) => ({
            id: key,                  // Ejemplo: "raulsalinas"
            nombre: zonasData[key].nombre // Ejemplo: "Zona Raúl Salinas"
          }));
          setZonas(arregloZonas);
        } else {
          setZonas([]);
        }

      } catch (error) {
        console.error("Error consultando Firebase:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, [municipioId]);

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
        <p style={{ fontSize: "1.2rem", color: "#2f2cc9" }}>⏳ Cargando sectores...</p>
      </div>
    </div>
  );
}

if (!municipioNombre) {
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
        <h2 style={{ color: "#2f2cc9", marginBottom: "20px" }}>🏛️ Municipio no encontrado</h2>
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
        {municipioNombre}
      </h1>
      <p className="subtitle" style={{ margin: 0, fontSize: "1rem", opacity: 0.9, color: "white" }}>
        Selecciona la zona o sector
      </p>
    </div>

    {/* Grid de zonas/sectores */}
    {zonas.length === 0 ? (
      <div style={{ 
        textAlign: "center", 
        padding: "40px",
        background: "#f8f9fa",
        borderRadius: "15px",
        marginTop: "20px"
      }}>
        <p style={{ color: "#666", fontSize: "1.1rem" }}>📭 No hay zonas registradas para este municipio.</p>
        <button 
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            color: "#2f2cc9",
            border: "2px solid #2f2cc9",
            padding: "10px 25px",
            borderRadius: "50px",
            fontSize: "0.9rem",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            marginTop: "20px"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#2f2cc9";
            e.target.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "#2f2cc9";
          }}
        >
          ← Volver al inicio
        </button>
      </div>
    ) : (
      <>
        <div className="grid" style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
          gap: "20px",
          padding: "10px",
          marginTop: "10px"
        }}>
          {zonas.map((z) => (
            <button
              key={z.id}
              className="card"
              onClick={() => navigate(`/municipio/${municipioId}/zona/${z.id}`)}
              style={{
                background: "white",
                border: "2px solid #e0e0e0",
                borderRadius: "15px",
                padding: "25px 15px",
                fontSize: "1rem",
                fontWeight: "bold",
                color: "#2f2cc9",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.borderColor = "#2f2cc9";
                e.target.style.boxShadow = "0 8px 20px rgba(47,44,201,0.2)";
                e.target.style.color = "#4f8fd9";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.borderColor = "#e0e0e0";
                e.target.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)";
                e.target.style.color = "#2f2cc9";
              }}
            >
              {z.nombre}
            </button>
          ))}
        </div>
        </>
    )}
  </div>
);
}