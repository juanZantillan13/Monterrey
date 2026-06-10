import { Link, useLocation } from "react-router-dom";
import { getMunicipios, getZonas, getColonias } from "../data/mockData";

export default function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  const crumbs = [{ url: "/", label: "Inicio" }];

  if (parts[0] === "municipio" && parts[1]) {
    const muns = getMunicipios();
    const mun = muns.find((m) => m.id === parts[1]);
    crumbs.push({
      url: `/municipio/${parts[1]}`,
      label: mun ? mun.nombre : parts[1],
    });
  }

  if (parts[2] === "zona" && parts[3]) {
    const zonas = getZonas(parts[1]);
    const zona = zonas.find((z) => z.id === parts[3]);
    crumbs.push({
      url: `/municipio/${parts[1]}/zona/${parts[3]}`,
      label: zona ? zona.nombre : parts[3],
    });
  }

  if (parts[4] === "colonia" && parts[5]) {
    const colonias = getColonias(parts[3]);
    const col = colonias.find((c) => c.id === parts[5]);
    crumbs.push({
      url: `/municipio/${parts[1]}/zona/${parts[3]}/colonia/${parts[5]}`,
      label: col ? col.nombre : parts[5],
    });
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol>
        {crumbs.map((cr, i) => (
          <li key={cr.url}>
            {i < crumbs.length - 1 ? (
              <Link to={cr.url}>{cr.label}</Link>
            ) : (
              <span aria-current="page">{cr.label}</span>
            )}
            {i < crumbs.length - 1 && <span className="sep">&gt;</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
