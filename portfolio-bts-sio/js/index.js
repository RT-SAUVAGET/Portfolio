document.getElementById("annee").textContent = new Date().getFullYear();

(async () => {
  initNav();
  const grid = document.getElementById("projets-grid");
  const synthese = document.getElementById("synthese-table");

  if (!CONFIG_OK) {
    grid.innerHTML = '<p class="empty">Les projets s\'afficheront ici une fois Supabase configuré.</p>';
    synthese.innerHTML = '<p class="empty" style="padding:16px">—</p>';
    return;
  }

  const { data: projets, error } = await sb
    .from("projets")
    .select("id, titre, resume, contexte, date_projet, technologies, competences, image_url")
    .order("ordre")
    .order("date_projet", { ascending: false });

  if (error) {
    grid.innerHTML = `<p class="alert">Erreur de chargement : ${esc(error.message)}</p>`;
    return;
  }
  if (!projets.length) {
    grid.innerHTML = '<p class="empty">Aucun projet pour le moment.</p>';
    synthese.innerHTML = '<p class="empty" style="padding:16px">Aucun projet.</p>';
    return;
  }

  grid.innerHTML = projets.map((p) => `
    <a class="card projet-card" href="projet.html?id=${p.id}">
      <div class="cover">${p.image_url ? `<img src="${esc(p.image_url)}" alt="" loading="lazy">` : esc(p.titre.charAt(0))}</div>
      <div class="body">
        <h3>${esc(p.titre)}</h3>
        <div class="meta">${esc(p.contexte || "")}${p.contexte && p.date_projet ? " · " : ""}${formatDate(p.date_projet)}</div>
        <p class="muted" style="margin:0">${esc(p.resume || "")}</p>
        <div class="badges">${(p.technologies || []).map((t) => `<span class="badge">${esc(t)}</span>`).join("")}</div>
      </div>
    </a>`).join("");

  const codes = Object.keys(COMPETENCES);
  synthese.innerHTML = `
    <table>
      <thead><tr><th>Réalisation</th>${codes.map((c) => `<th class="c" title="${esc(COMPETENCES[c])}">${c}</th>`).join("")}</tr></thead>
      <tbody>
        ${projets.map((p) => `
          <tr>
            <td><a href="projet.html?id=${p.id}">${esc(p.titre)}</a></td>
            ${codes.map((c) => `<td class="check">${(p.competences || []).includes(c) ? "✓" : ""}</td>`).join("")}
          </tr>`).join("")}
      </tbody>
    </table>`;
})();
