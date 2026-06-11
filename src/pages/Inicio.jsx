import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Inicio() {
  const navigate = useNavigate();
  
  // Estados originales
  const [municipios, setMunicipios] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ─── NUEVOS ESTADOS PARA REPORTES ───
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [baseDatosCompleta, setBaseDatosCompleta] = useState(null); // Guarda todo el JSON de Firebase
  
  // Estados del formulario
  const [muniSeleccionado, setMuniSeleccionado] = useState("");
  const [zonaSeleccionada, setZonaSeleccionada] = useState("");
  const [coloniaSeleccionada, setColoniaSeleccionada] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);

  const DB_URL = "https://agua-mty-default-rtdb.firebaseio.com";

  useEffect(() => {
    async function cargarDatosReal() {
      try {
        setCargando(true);
        
        // Traemos los municipios limpios
        const response = await fetch(`${DB_URL}/municipios.json`);
        const data = await response.json();
        
        if (data) {
          setBaseDatosCompleta(data); // Guardamos todo el árbol para los selectores del reporte
          
          const arregloMuni = Object.keys(data).map((key) => ({
            id: key,                  // Ejemplo: "sannicolas"
            nombre: data[key].nombre  // Ejemplo: "San Nicolás de los Garza"
          }));
          setMunicipios(arregloMuni);
        }
      } catch (error) {
        console.error("Error al conectar con Firebase:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatosReal();
  }, []);

  // ─── FUNCIÓN PARA GUARDAR EL REPORTE EN FIREBASE ───
  const manejarEnvioReporte = async (e) => {
    e.preventDefault();
    if (!muniSeleccionado || !zonaSeleccionada || !coloniaSeleccionada || !descripcion.trim()) {
      return alert("Por favor, llena todos los campos del reporte.");
    }

    try {
      setEnviando(true);
      
      // Obtenemos los nombres limpios para que el admin los lea fácil
      const nombreMuni = baseDatosCompleta[muniSeleccionado].nombre;
      const nombreZona = baseDatosCompleta[muniSeleccionado].zonas[zonaSeleccionada].nombre;
      const nombreColonia = baseDatosCompleta[muniSeleccionado].zonas[zonaSeleccionada].colonias[coloniaSeleccionada].nombre;

      const nuevoReporte = {
        municipioId: muniSeleccionado,
        municipioNombre: nombreMuni,
        zonaId: zonaSeleccionada,
        zonaNombre: nombreZona,
        coloniaId: coloniaSeleccionada,
        coloniaNombre: nombreColonia,
        descripcion: descripcion.trim(),
        estatus: "Pendiente",
        fecha: new Date().toISOString() // Estampa de tiempo legible
      };

      // Hacemos un POST a una nueva rama llamada 'reportes.json'
      const res = await fetch(`${DB_URL}/reportes.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoReporte)
      });

      if (res.ok) {
        alert("¡Reporte enviado con éxito a la base de datos!");
        // Limpiar formulario y cerrar
        setMuniSeleccionado("");
        setZonaSeleccionada("");
        setColoniaSeleccionada("");
        setDescripcion("");
        setMostrarFormulario(false);
      } else {
        alert("Hubo un problema al subir el reporte.");
      }
    } catch (err) {
      console.error("Error al enviar reporte:", err);
      alert("Error de red al conectar con Firebase.");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="page">
        
        <p>Cargando municipios desde la base de datos...</p>
      </div>
    );
  }

 return (
  <div className="page" style={{ paddingBottom: "40px" }}>
    {/* Encabezdo con gradiente azul */}
    <div style={{ 
      background: "linear-gradient(135deg, #2f2cc9 0%, #4f8fd9 100%)", 
      borderRadius: "20px", 
      padding: "30px 20px", 
      marginBottom: "30px",
      color: "white",
      textAlign: "center",
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ margin: "0 0 10px 0", fontSize: "2.5rem" }}> Cortes de Agua - Nuevo León</h1>
      <p className="subtitle" style={{ margin: 0, fontSize: "1.1rem", opacity: 0.95, color: "white"}}>
        Consulta cortes de agua, reporta incidencias y mantente informado sobre tu municipio.
      </p>
    </div>

    {/* 🚨 BOTÓN PRINCIPAL PARA ACTIVAR EL FORMULARIO */}
    <div style={{ textAlign: "center", margin: "20px 0 30px 0" }}>
      <button 
        className="card" 
        style={{ 
          background: mostrarFormulario ? "#6c757d" : "#2f2cc9", 
          color: "white", 
          fontWeight: "bold", 
          padding: "14px 32px", 
          border: "none",
          borderRadius: "50px",
          fontSize: "1rem",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
        }}
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
          if (!mostrarFormulario) e.target.style.background = "#4f8fd9";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
          if (!mostrarFormulario) e.target.style.background = "#2f2cc9";
        }}
      >
        {mostrarFormulario ? " Cancelar Reporte" : " ¿No tienes agua? Reportar corte aquí"}
      </button>
    </div>

    {/* 📂 COMPONENTE DEL FORMULARIO EN CASCADA */}
    {mostrarFormulario && baseDatosCompleta && (
      <div className="card" style={{ 
        maxWidth: "550px", 
        margin: "0 auto 40px auto", 
        padding: "25px", 
        textAlign: "left",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0"
      }}>
        <h2 style={{ marginTop: 0, marginBottom: "20px", color: "#2f2cc9", display: "flex", alignItems: "center", gap: "10px" }}>
          📝 Formulario de Reporte
        </h2>
        <form onSubmit={manejarEnvioReporte}>
          
          {/* SELECT 1: MUNICIPIOS */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>🏛️ Municipio:</label>
            <select 
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #ccc", fontSize: "0.95rem" }}
              value={muniSeleccionado} 
              onChange={(e) => { setMuniSeleccionado(e.target.value); setZonaSeleccionada(""); setColoniaSeleccionada(""); }}
            >
              <option value=""> Selecciona Municipio </option>
              {municipios.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>

          {/* SELECT 2: ZONAS */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>🗺️ Zona:</label>
            <select 
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #ccc", background: !muniSeleccionado ? "#f8f9fa" : "white" }}
              disabled={!muniSeleccionado}
              value={zonaSeleccionada}
              onChange={(e) => { setZonaSeleccionada(e.target.value); setColoniaSeleccionada(""); }}
            >
              <option value=""> Selecciona Zona </option>
              {muniSeleccionado && baseDatosCompleta[muniSeleccionado].zonas && 
                Object.keys(baseDatosCompleta[muniSeleccionado].zonas).map(zKey => (
                  <option key={zKey} value={zKey}>{baseDatosCompleta[muniSeleccionado].zonas[zKey].nombre || zKey}</option>
                ))
              }
            </select>
          </div>

          {/* SELECT 3: COLONIAS */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>🏘️ Colonia:</label>
            <select 
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #ccc", background: !zonaSeleccionada ? "#f8f9fa" : "white" }}
              disabled={!zonaSeleccionada}
              value={coloniaSeleccionada}
              onChange={(e) => setColoniaSeleccionada(e.target.value)}
            >
              <option value=""> Selecciona Colonia </option>
              {muniSeleccionado && zonaSeleccionada && baseDatosCompleta[muniSeleccionado].zonas[zonaSeleccionada].colonias &&
                Object.keys(baseDatosCompleta[muniSeleccionado].zonas[zonaSeleccionada].colonias).map(cKey => (
                  <option key={cKey} value={cKey}>
                    {baseDatosCompleta[muniSeleccionado].zonas[zonaSeleccionada].colonias[cKey].nombre}
                  </option>
                ))
              }
            </select>
          </div>

          {/* CAJA DE TEXTO PARA DESCRIPCIÓN */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>📝 Detalle del reporte:</label>
            <textarea 
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #ccc", minHeight: "100px", resize: "vertical", fontSize: "0.95rem" }}
              placeholder="Ej: Llevamos más de 12 horas sin servicio y baja presión..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={enviando}
            style={{ 
              background: "#4f8fd9", 
              color: "white", 
              border: "none", 
              padding: "12px 20px", 
              borderRadius: "50px", 
              cursor: "pointer", 
              width: "100%",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#2f2cc9";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#4f8fd9";
              e.target.style.transform = "translateY(0)";
            }}
          >
            {enviando ? "⏳ Enviando..." : "Enviar Reporte Oficial"}
          </button>
        </form>
      </div>
    )}

    {/* GRID ORIGINAL DE MUNICIPIOS - Mejorado */}
    <div style={{ marginTop: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
        🏙️ Municipios de Nuevo León
      </h2>
      <div className="grid" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", 
        gap: "20px",
        padding: "10px"
      }}>
        {municipios.map((m) => (
          <button
            key={m.id}
            className="card"
            onClick={() => navigate(`/municipio/${m.id}`)}
            style={{
              background: "white",
              border: "2px solid #e0e0e0",
              borderRadius: "15px",
              padding: "20px 15px",
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
            {m.nombre}
          </button>
        ))}
      </div>
    </div>
  </div>
);
}