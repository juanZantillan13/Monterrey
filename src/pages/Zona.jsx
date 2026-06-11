import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Zona() {
  const { municipioId, zonaId } = useParams();
  const navigate = useNavigate();

  // Estados para almacenar los datos reales de Firebase
  const [municipioNombre, setMunicipioNombre] = useState(""); 
  const [zonaNombre, setZonaNombre] = useState("");
  const [colonias, setColonias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Tu URL de Firebase
  const DB_URL = "https://agua-mty-default-rtdb.firebaseio.com";

  useEffect(() => {
    async function cargarDatosZona() {
      try {
        setCargando(true);

        // 1. Traer el nombre limpio del municipio para los breadcrumbs (Ruta limpia)
        const responseMuniNombre = await fetch(
          `${DB_URL}/municipios/${municipioId}/nombre.json`
        );
        const nombreM = await responseMuniNombre.json();
        if (nombreM) setMunicipioNombre(nombreM);

        // 2. Traer el nombre limpio de la zona
        const responseZonaNombre = await fetch(
          `${DB_URL}/municipios/${municipioId}/zonas/${zonaId}/nombre.json`
        );
        const nombreZ = await responseZonaNombre.json();
        if (nombreZ) setZonaNombre(nombreZ);

        // 3. Traer las colonias del sector
        const responseColonias = await fetch(
          `${DB_URL}/municipios/${municipioId}/zonas/${zonaId}/colonias.json`
        );
        const coloniasData = await responseColonias.json();

        if (coloniasData) {
          const arregloColonias = Object.keys(coloniasData).map((key) => ({
            id: key,                      
            nombre: coloniasData[key].nombre 
          }));
          setColonias(arregloColonias);
        } else {
          setColonias([]);
        }

      } catch (error) {
        console.error("Error en Zona:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatosZona();
  }, [municipioId, zonaId]);

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
        <p style={{ fontSize: "1.2rem", color: "#2f2cc9" }}>⏳ Cargando colonias del sector...</p>
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
        {zonaNombre || "Sector"}
      </h1>
      <p className="subtitle" style={{ margin: 0, fontSize: "1rem", opacity: 0.9, color: "white" }}>
        Selecciona tu colonia para ver el estatus
      </p>
    </div>

    {/* Grid de colonias */}
    {colonias.length === 0 ? (
      <div style={{ 
        textAlign: "center", 
        padding: "40px",
        background: "#f8f9fa",
        borderRadius: "15px",
        marginTop: "20px"
      }}>
        <p style={{ color: "#666", fontSize: "1.1rem" }}>📭 No hay colonias registradas en esta zona.</p>
        <button 
          onClick={() => navigate(`/municipio/${municipioId}`)}
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
          ← Volver al municipio
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
          {colonias.map((c) => (
            <button
              key={c.id}
              className="card"
              onClick={() => navigate(`/municipio/${municipioId}/zona/${zonaId}/colonia/${c.id}`)}
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
              {c.nombre}
            </button>
          ))}
        </div>

      </>
    )}
  </div>
);
}