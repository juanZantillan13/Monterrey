// src/pages/Admin.jsx - Versión corregida

import { useState, useEffect } from "react";
import { auth, signInWithEmailAndPassword, signOut } from "../firebase";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [autenticando, setAutenticando] = useState(false);
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstatus, setFiltroEstatus] = useState("todos");
  
  // Estados para validación de login
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  
  const DB_URL = "https://agua-mty-default-rtdb.firebaseio.com";

  // Verificar si ya hay una sesión activa al cargar
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  async function obtenerReportes() {
    try {
      setCargando(true);
      const response = await fetch(`${DB_URL}/reportes.json`);
      const data = await response.json();
      
      if (data) {
        const arregloReportes = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        arregloReportes.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setReportes(arregloReportes);
      } else {
        setReportes([]);
      }
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      obtenerReportes();
    }
  }, [isLoggedIn]);

  // ─── VALIDACIONES DEL FRONTEND ───
  const validarEmail = (email) => {
    // 1. Validar que no esté vacío
    if (!email.trim()) {
      return "El email es obligatorio";
    }
    
    // 2. Validar longitud mínima y máxima
    if (email.length < 5) {
      return "El email debe tener al menos 5 caracteres";
    }
    if (email.length > 100) {
      return "El email no puede exceder 100 caracteres";
    }
    
    // 3. Validar que contenga @ (obligatorio)
    if (!email.includes('@')) {
      return "El email debe contener el símbolo @";
    }
    
    // 4. Validar formato completo con regex (más estricto)
    // Esta regex valida: texto@dominio.extension
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Email inválido (ejemplo: admin@aguamty.com)";
    }
    
    // 5. Validar que no tenga espacios
    if (email.includes(' ')) {
      return "El email no puede contener espacios";
    }
    
    return "";
  };

  const validarPassword = (password) => {
    if (!password) {
      return "La contraseña es obligatoria";
    }
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    if (password.length > 50) {
      return "La contraseña no puede exceder 50 caracteres";
    }
    return "";
  };

  // Validar en tiempo real
  useEffect(() => {
    if (touched.email) {
      setErrorEmail(validarEmail(email));
    }
  }, [email, touched.email]);

  useEffect(() => {
    if (touched.password) {
      setErrorPassword(validarPassword(password));
    }
  }, [password, touched.password]);

  const esFormularioValido = () => {
    return validarEmail(email) === "" && validarPassword(password) === "";
  };

  // 🔐 LOGIN CON FIREBASE AUTHENTICATION (REAL)
  const manejarLogin = async (e) => {
    e.preventDefault();
    
    // Marcar campos como tocados para mostrar errores
    setTouched({ email: true, password: true });
    
    // Validaciones frontend antes de llamar a Firebase
    const emailError = validarEmail(email);
    const passwordError = validarPassword(password);
    
    if (emailError || passwordError) {
      setErrorEmail(emailError);
      setErrorPassword(passwordError);
      return;
    }

    try {
      setAutenticando(true);
      
      // Usando Firebase Authentication REAL
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        setIsLoggedIn(true);
        // Limpiar errores al loguearse exitosamente
        setErrorEmail("");
        setErrorPassword("");
        setTouched({ email: false, password: false });
      }
    } catch (error) {
      console.error("Error de autenticación:", error);
      
      // Mensajes de error más amigables
      switch (error.code) {
        case 'auth/user-not-found':
          setErrorEmail("❌ No existe una cuenta con este email");
          break;
        case 'auth/wrong-password':
          setErrorPassword("❌ Contraseña incorrecta");
          break;
        case 'auth/invalid-email':
          setErrorEmail("❌ Email inválido");
          break;
        case 'auth/too-many-requests':
          setErrorEmail("❌ Demasiados intentos. Espera un momento");
          break;
        default:
          alert(`❌ Error: ${error.message}`);
      }
    } finally {
      setAutenticando(false);
    }
  };

  const cambiarEstatus = async (id, nuevoEstatus) => {
    try {
      const res = await fetch(`${DB_URL}/reportes/${id}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estatus: nuevoEstatus })
      });
      if (res.ok) {
        setReportes(reportes.map(rep => rep.id === id ? { ...rep, estatus: nuevoEstatus } : rep));
      }
    } catch (error) {
      console.error("Error al actualizar estatus:", error);
    }
  };

  const eliminarReporte = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este reporte?")) return;
    
    try {
      const res = await fetch(`${DB_URL}/reportes/${id}.json`, {
        method: "DELETE"
      });
      if (res.ok) {
        setReportes(reportes.filter(rep => rep.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar reporte:", error);
    }
  };

  const manejarLogout = async () => {
    try {
      await signOut(auth);
      setEmail("");
      setPassword("");
      setErrorEmail("");
      setErrorPassword("");
      setTouched({ email: false, password: false });
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const reportesFiltrados = filtroEstatus === "todos" 
    ? reportes 
    : reportes.filter(rep => rep.estatus === filtroEstatus);

  const estadisticas = {
    total: reportes.length,
    pendientes: reportes.filter(r => r.estatus === "Pendiente").length,
    revision: reportes.filter(r => r.estatus === "En Revisión").length,
    resueltos: reportes.filter(r => r.estatus === "Resuelto").length
  };

  // ─── VISTA DE LOGIN ───
  if (!isLoggedIn) {
    return (
      <div className="page" style={{ 
        minHeight: "calc(100vh - 200px)", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center" 
      }}>
        <div className="card" style={{ 
          maxWidth: "420px", 
          width: "100%", 
          padding: "40px",
          textAlign: "center"
        }}>
          <div style={{ 
            width: "70px", 
            height: "70px", 
            background: "#0275d8", 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            margin: "0 auto 20px auto"
          }}>
            <span style={{ fontSize: "32px" }}>🔐</span>
          </div>
          
          <h2 style={{ marginBottom: "10px", color: "#0275d8" }}>
            Panel de Administración
          </h2>
          <p className="subtitle" style={{ marginBottom: "30px" }}>
            Ingresa tus credenciales
          </p>
          
          <form onSubmit={manejarLogin} noValidate>
            {/* Campo EMAIL */}
            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                Email *
              </label>
              <input 
                type="text"  // Cambiado de "email" a "text" para validación manual
                placeholder="admin@gmail.com"
                style={{ 
                  width: "100%", 
                  padding: "12px", 
                  borderRadius: "8px", 
                  border: errorEmail && touched.email ? "2px solid #d9534f" : "1px solid #ddd", 
                  fontSize: "15px",
                  backgroundColor: errorEmail && touched.email ? "#fff5f5" : "white"
                }}
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                onBlur={() => setTouched({ ...touched, email: true })}
                disabled={autenticando}
                required
              />
              {touched.email && errorEmail && (
                <p style={{ color: "#d9534f", fontSize: "12px", marginTop: "5px", marginBottom: "0" }}>
                  ❌ {errorEmail}
                </p>
              )}
              <p style={{ color: "#999", fontSize: "11px", marginTop: "5px", marginBottom: "0" }}>
                 Mínimo 5, máximo 100 caracteres. Debe contener @
              </p>
            </div>
            
            {/* Campo CONTRASEÑA */}
            <div style={{ marginBottom: "25px", textAlign: "left" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                Contraseña *
              </label>
              <input 
                type="password" 
                placeholder="•••••••• (mínimo 6 caracteres)"
                style={{ 
                  width: "100%", 
                  padding: "12px", 
                  borderRadius: "8px", 
                  border: errorPassword && touched.password ? "2px solid #d9534f" : "1px solid #ddd",
                  fontSize: "15px",
                  backgroundColor: errorPassword && touched.password ? "#fff5f5" : "white"
                }}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                onBlur={() => setTouched({ ...touched, password: true })}
                disabled={autenticando}
                required
              />
              {touched.password && errorPassword && (
                <p style={{ color: "#d9534f", fontSize: "12px", marginTop: "5px", marginBottom: "0" }}>
                  ❌ {errorPassword}
                </p>
              )}
              <p style={{ color: "#999", fontSize: "11px", marginTop: "5px", marginBottom: "0" }}>
                 Mínimo 6, máximo 50 caracteres
              </p>
            </div>
            
            <button 
              type="submit" 
              disabled={autenticando || !esFormularioValido()}
              style={{ 
                width: "100%", 
                padding: "12px", 
                background: (autenticando || !esFormularioValido()) ? "#ccc" : "#0275d8", 
                color: "white", 
                border: "none", 
                borderRadius: "8px", 
                cursor: (autenticando || !esFormularioValido()) ? "not-allowed" : "pointer", 
                fontWeight: "600", 
                fontSize: "16px"
              }}
            >
              {autenticando ? "Verificando..." : "Acceder al Panel"}
            </button>
          </form>
          
          <p style={{ 
            fontSize: "12px", 
            color: "#999", 
            marginTop: "25px",
            borderTop: "1px solid #eee",
            paddingTop: "20px"
          }}>
            Acceso restringido - Usa tu email y contraseña de Firebase Auth
          </p>
        </div>
      </div>
    );
  }

  // ─── PANEL ADMINISTRATIVO (igual que antes, sin cambios) ───
  if (cargando) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
        <p>Cargando reportes...</p>
      </div>
    );
  }

  return (
    <div className="page" style={{ padding: "20px 20px 40px 20px" }}>
      {/* Header */}
      <div style={{ 
        background: "linear-gradient(135deg, #0275d8 0%, #0056b3 100%)", 
        borderRadius: "12px", 
        padding: "30px",
        marginBottom: "30px",
        color: "white"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <h1 style={{ margin: 0 }}>Panel de Control</h1>
            <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>
              Bienvenido, {auth.currentUser?.email}
            </p>
          </div>
          <button 
            onClick={manejarLogout} 
            style={{ 
              background: "rgba(255,255,255,0.2)", 
              color: "white", 
              border: "1px solid rgba(255,255,255,0.3)", 
              padding: "10px 20px", 
              borderRadius: "8px", 
              cursor: "pointer"
            }}
          >
           Cerrar Sesión
          </button>
        </div>

        {/* Estadísticas */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "15px",
          marginTop: "25px"
        }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "15px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold" }}>{estadisticas.total}</div>
            <div>📊 Total Reportes</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "15px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold" }}>{estadisticas.pendientes}</div>
            <div>⚠️ Pendientes</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "15px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold" }}>{estadisticas.revision}</div>
            <div>🔄 En Revisión</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "15px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold" }}>{estadisticas.resueltos}</div>
            <div>✅ Resueltos</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px", flexWrap: "wrap", justifyContent: "center" }}>
        {["todos", "Pendiente", "En Revisión", "Resuelto"].map(estatus => (
          <button
            key={estatus}
            onClick={() => setFiltroEstatus(estatus)}
            style={{
              padding: "8px 20px",
              background: filtroEstatus === estatus ? "#0275d8" : "#f0f0f0",
              color: filtroEstatus === estatus ? "white" : "#333",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer"
            }}
          >
            {estatus === "todos" ? "📋 Todos" : estatus === "Pendiente" ? "⚠️ Pendiente" : estatus === "En Revisión" ? "🔄 En Revisión" : "✅ Resuelto"}
          </button>
        ))}
      </div>

      {/* Lista de reportes */}
      {reportesFiltrados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#f9f9f9", borderRadius: "12px" }}>
          <p>📭 No hay reportes {filtroEstatus !== "todos" ? `con estado "${filtroEstatus}"` : ""}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {reportesFiltrados.map((rep) => (
            <div key={rep.id} className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
                    <span style={{ 
                      padding: "4px 12px", 
                      borderRadius: "20px", 
                      fontSize: "12px", 
                      fontWeight: "bold",
                      background: rep.estatus === "Pendiente" ? "#d9534f" : rep.estatus === "En Revisión" ? "#f0ad4e" : "#5cb85c",
                      color: "white"
                    }}>
                      {rep.estatus}
                    </span>
                    <span style={{ fontSize: "12px", color: "#999" }}>
                      📅 {new Date(rep.fecha).toLocaleString("es-MX")}
                    </span>
                  </div>

                  <div style={{ fontWeight: "bold", color: "#0275d8" }}>
                    🏛️ {rep.municipioNombre}
                  </div>
                  <div style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
                    📍 {rep.zonaNombre} — Col. {rep.coloniaNombre}
                  </div>

                  <div style={{ background: "#f8f9fa", padding: "12px", borderRadius: "8px", marginBottom: "15px" }}>
                    <strong>📝 Descripción:</strong>
                    <p style={{ margin: "8px 0 0 0", whiteSpace: "pre-wrap" }}>{rep.descripcion}</p>
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <select 
                      style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd", cursor: "pointer" }}
                      value={rep.estatus} 
                      onChange={(e) => cambiarEstatus(rep.id, e.target.value)}
                    >
                      <option value="Pendiente">📌 Pendiente</option>
                      <option value="En Revisión">🔄 En Revisión</option>
                      <option value="Resuelto">✅ Resuelto</option>
                    </select>
                    <button 
                      onClick={() => eliminarReporte(rep.id)}
                      style={{ background: "#fff", color: "#d9534f", border: "1px solid #d9534f", padding: "7px 15px", borderRadius: "6px", cursor: "pointer" }}
                      onMouseEnter={(e) => { e.target.style.background = "#d9534f"; e.target.style.color = "white"; }}
                      onMouseLeave={(e) => { e.target.style.background = "#fff"; e.target.style.color = "#d9534f"; }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}