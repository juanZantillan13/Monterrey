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
    return <div className="page"><p>Cargando colonias del sector...</p></div>;
  }

  return (
    <div className="page">
      

      <h1>{zonaNombre || "Sector"}</h1>
      <p className="subtitle">Selecciona tu colonia para ver el estatus</p>

      {colonias.length === 0 ? (
        <p>No hay colonias registradas en esta zona.</p>
      ) : (
        <div className="grid">
          {colonias.map((c) => (
            <button
              key={c.id}
              className="card"
              onClick={() => navigate(`/municipio/${municipioId}/zona/${zonaId}/colonia/${c.id}`)}
            >
              {c.nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}