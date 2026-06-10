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
    return <div className="page"><p>Cargando sectores...</p></div>;
  }

  if (!municipioNombre) {
    return (
      <div className="page">
        <h2>Municipio no encontrado</h2>
        <button className="card" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{municipioNombre}</h1>
      <p className="subtitle">Selecciona la zona o sector</p>

      {zonas.length === 0 ? (
        <p>No hay zonas registradas para este municipio.</p>
      ) : (
        <div className="grid">
          {zonas.map((z) => (
            <button
              key={z.id}
              className="card"
              onClick={() => navigate(`/municipio/${municipioId}/zona/${z.id}`)}
            >
              {z.nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}