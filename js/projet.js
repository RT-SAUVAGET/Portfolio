(async () => {
  const root = document.getElementById("projet");
  const id = Number(new URLSearchParams(location.search).get("id"));
  const user = await initNav();

  if (!CONFIG_OK || !id) {
    root.innerHTML = '<p class="alert" style="margin:48px 0">Projet introuvable.</p>';
    return;
  }

  const { data: p, error } = await sb.from("projets").select("*").eq("id", id).single();
  if (error || !p) {
    root.innerHTML = '<p class="alert" style="margin:48px 0">Projet introuvable.</p>';
    return;
  }
  document.title = `${p.titre} — Portfolio`;

  root.innerHTML = `
    <div class="projet-header">
      <div class="meta">${esc(p.contexte || "")}${p.contexte && p.date_projet ? " · " : ""}${formatDate(p.date_projet)}</div>
      <h1>${esc(p.titre)}</h1>
      <p class="muted" style="font-size:1.1rem">${esc(p.resume || "")}</p>
    </div>
    ${p.image_url ? `<div class="projet-cover"><img src="${esc(p.image_url)}" alt=""></div>` : ""}
    <div class="projet-layout">
      <div style="display:grid;gap:28px;grid-template-columns:minmax(0,1fr)">
        <div class="card rich">${renderRich(p.description || "Pas de description.")}</div>
        <div class="card">
          <h2 style="font-size:1.4rem">Documentation</h2>
          <div id="docs"></div>
        </div>
      </div>
      <aside>
        <div class="card">
          <h3>Technologies utilisées</h3>
          <div class="badges">${(p.technologies || []).map((t) => `<span class="badge blue">${esc(t)}</span>`).join("") || '<span class="empty">—</span>'}</div>
        </div>
        <div class="card">
          <h3>Compétences BTS (bloc 1)</h3>
          ${(p.competences || []).length
            ? `<ul class="check-list" style="margin:0">${p.competences.map((c) => `<li><strong>${esc(c)}</strong> — ${esc(COMPETENCES[c] || "")}</li>`).join("")}</ul>`
            : '<span class="empty">—</span>'}
        </div>
      </aside>
    </div>`;

  const docs = document.getElementById("docs");

  if (!user) {
    docs.innerHTML = `
      <div class="card lock">
        <div class="ico">🔒</div>
        <p>La documentation technique de ce projet est réservée aux examinateurs.</p>
        <a class="btn" href="login.html?redirect=${encodeURIComponent("projet.html?id=" + id)}">Se connecter</a>
      </div>`;
    return;
  }

  const { data: list, error: e2 } = await sb
    .from("documents").select("*").eq("projet_id", id).order("created_at");

  if (e2) {
    docs.innerHTML = `<p class="alert">${esc(e2.message)}</p>`;
    return;
  }
  if (!list.length) {
    docs.innerHTML = '<p class="empty">Aucun document pour ce projet.</p>';
    return;
  }

  docs.innerHTML = `<ul class="doc-list">${list.map((d) => `
    <li class="doc-item">
      <div class="doc-icon">${fileIcon(d.type, d.nom)}</div>
      <div class="doc-info"><strong title="${esc(d.nom)}">${esc(d.nom)}</strong><span class="meta">${formatSize(d.taille)}</span></div>
      <button class="btn btn-sm btn-ghost" data-chemin="${esc(d.chemin)}">Consulter</button>
    </li>`).join("")}</ul>`;

  docs.querySelectorAll("button[data-chemin]").forEach((b) =>
    b.addEventListener("click", () => openDocument(b.dataset.chemin))
  );
})();
