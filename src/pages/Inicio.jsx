import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Inicio() {
  const navigate = useNavigate();
  
  // Estados para controlar los municipios reales y la carga
  const [municipios, setMunicipios] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Tu URL real de Firebase (sin la barra "/" al final)
  const DB_URL = "https://agua-mty-default-rtdb.firebaseio.com";

  useEffect(() => {
    async function cargarMunicipiosReal() {
      try {
        setCargando(true);
        
        // Hacemos el fetch a la ruta limpia en tu Firebase
        const response = await fetch(`${DB_URL}/municipios.json`);
        const data = await response.json();
        console.log("=== CHISMOSO DE FIREBASE ===", data);

        // 👇 CORREGIDO: Como ya no hay doble carpeta, mapeamos directamente las llaves de 'data'
        if (data) {
          const arregloMuni = Object.keys(data).map((key) => ({
            id: key,                  // Ejemplo: "sannicolas" o "garcia"
            nombre: data[key].nombre  // Ejemplo: "San Nicolás de los Garza"
          }));
          setMunicipios(arregloMuni);
        }
      } catch (error) {
        console.error("Error al conectar con el inicio de Firebase:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarMunicipiosReal();
  }, []);

  if (cargando) {
    return (
      <div className="page">
        <p>Cargando municipios desde la base de datos...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>💧 Cortes de Agua - Monterrey</h1>
      <p className="subtitle">
        Selecciona tu municipio para consultar los horarios de cortes de agua
      </p>

      <div className="grid">
        {municipios.map((m) => (
          <button
            key={m.id}
            className="card"
            onClick={() => navigate(`/municipio/${m.id}`)}
          >
            {m.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}