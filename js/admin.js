let projets = [];
let editingId = null;
let editingImage = null;

const $ = (s) => document.querySelector(s);
const form = $("#projet-form");

// ---------- Contrôle d'accès ----------
(async () => {
  const user = await initNav();
  if (!user) {
    location.href = "login.html?redirect=admin.html";
    return;
  }
  if (user.role !== "admin") {
    $("#guard").innerHTML = '<p class="alert">Accès réservé à l\'administrateur. Ton compte permet uniquement de consulter les documents.</p>';
    return;
  }
  $("#guard").remove();
  $("#admin").hidden = false;

  $("#competences-checks").innerHTML = Object.entries(COMPETENCES).map(([code, lib]) => `
    <label><input type="checkbox" name="competences" value="${code}"> <span><strong>${code}</strong> — ${esc(lib)}</span></label>`).join("");

  await loadProjets();
})();

// ---------- Onglets ----------
function showTab(name) {
  document.querySelectorAll(".admin-tabs button").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  document.querySelectorAll(".panel").forEach((p) => (p.hidden = p.id !== "panel-" + name));
}
document.querySelectorAll(".admin-tabs button").forEach((b) =>
  b.addEventListener("click", () => {
    if (b.dataset.tab === "form") resetForm();
    if (b.dataset.tab === "docs") loadDocs();
    showTab(b.dataset.tab);
  })
);

// ---------- Liste ----------
async function loadProjets() {
  const { data, error } = await sb
    .from("projets")
    .select("*, documents(count)")
    .order("ordre")
    .order("date_projet", { ascending: false });

  const body = $("#projets-body");
  if (error) {
    body.innerHTML = `<tr><td colspan="6"><p class="alert">${esc(error.message)}</p></td></tr>`;
    return;
  }
  projets = data;

  body.innerHTML = projets.length
    ? projets.map((p) => `
      <tr>
        <td>${p.image_url ? `<img class="thumb" src="${esc(p.image_url)}" alt="">` : "—"}</td>
        <td><a href="projet.html?id=${p.id}" target="_blank">${esc(p.titre)}</a></td>
        <td>${esc(p.contexte || "")}</td>
        <td>${formatDate(p.date_projet)}</td>
        <td>${p.documents?.[0]?.count ?? 0}</td>
        <td class="actions-cell">
          <button class="btn btn-sm btn-ghost" data-edit="${p.id}">Modifier</button>
          <button class="btn btn-sm btn-ghost" data-docs="${p.id}">Documents</button>
          <button class="btn btn-sm btn-danger" data-del="${p.id}">Supprimer</button>
        </td>
      </tr>`).join("")
    : '<tr><td colspan="6" class="empty">Aucun projet. Clique sur « + Nouveau projet ».</td></tr>';

  body.querySelectorAll("[data-edit]").forEach((b) => (b.onclick = () => editProjet(+b.dataset.edit)));
  body.querySelectorAll("[data-docs]").forEach((b) => (b.onclick = () => {
    $("#doc-projet").value = b.dataset.docs;
    loadDocs();
    showTab("docs");
  }));
  body.querySelectorAll("[data-del]").forEach((b) => (b.onclick = () => deleteProjet(+b.dataset.del)));

  const sel = $("#doc-projet");
  const current = sel.value;
  sel.innerHTML = projets.map((p) => `<option value="${p.id}">${esc(p.titre)}</option>`).join("");
  if (current && projets.some((p) => String(p.id) === current)) sel.value = current;
}

// ---------- Formulaire ----------
function resetForm() {
  form.reset();
  editingId = null;
  editingImage = null;
  $("#form-title").textContent = "Nouveau projet";
  $("#image-actuelle").textContent = "";
  $("#form-msg").innerHTML = "";
}

function editProjet(id) {
  const p = projets.find((x) => x.id === id);
  if (!p) return;
  resetForm();
  editingId = id;
  editingImage = p.image_url;
  $("#form-title").textContent = "Modifier : " + p.titre;
  form.titre.value = p.titre;
  form.contexte.value = p.contexte || "";
  form.date_projet.value = p.date_projet || "";
  form.ordre.value = p.ordre ?? 0;
  form.resume.value = p.resume || "";
  form.description.value = p.description || "";
  form.technologies.value = (p.technologies || []).join(", ");
  form.querySelectorAll('[name="competences"]').forEach((c) => (c.checked = (p.competences || []).includes(c.value)));
  if (p.image_url) $("#image-actuelle").innerHTML = 'Image actuelle conservée si aucun nouveau fichier. <a href="' + esc(p.image_url) + '" target="_blank">Voir</a>';
  showTab("form");
}

$("#annuler").onclick = () => { resetForm(); showTab("liste"); };

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const msg = $("#form-msg");
  btn.disabled = true;
  msg.innerHTML = "";

  const payload = {
    titre: form.titre.value.trim(),
    contexte: form.contexte.value.trim() || null,
    date_projet: form.date_projet.value || null,
    ordre: parseInt(form.ordre.value, 10) || 0,
    resume: form.resume.value.trim() || null,
    description: form.description.value.trim() || null,
    technologies: form.technologies.value.split(",").map((t) => t.trim()).filter(Boolean),
    competences: [...form.querySelectorAll('[name="competences"]:checked')].map((c) => c.value),
  };

  try {
    const file = form.image.files[0];
    if (file) {
      const path = `${Date.now()}-${slug(file.name)}`;
      const { error } = await sb.storage.from("images").upload(path, file);
      if (error) throw error;
      payload.image_url = sb.storage.from("images").getPublicUrl(path).data.publicUrl;
      if (editingImage) await removeImage(editingImage);
    }

    const { error } = editingId
      ? await sb.from("projets").update(payload).eq("id", editingId)
      : await sb.from("projets").insert(payload);
    if (error) throw error;

    resetForm();
    await loadProjets();
    showTab("liste");
  } catch (err) {
    msg.innerHTML = `<p class="alert">Erreur : ${esc(err.message)}</p>`;
  } finally {
    btn.disabled = false;
  }
});

async function removeImage(url) {
  const marker = "/storage/v1/object/public/images/";
  const i = url.indexOf(marker);
  if (i !== -1) await sb.storage.from("images").remove([decodeURIComponent(url.slice(i + marker.length))]);
}

async function deleteProjet(id) {
  const p = projets.find((x) => x.id === id);
  if (!confirm(`Supprimer définitivement « ${p.titre} » et tous ses documents ?`)) return;

  const { data: docs } = await sb.from("documents").select("chemin").eq("projet_id", id);
  if (docs?.length) await sb.storage.from("documents").remove(docs.map((d) => d.chemin));
  if (p.image_url) await removeImage(p.image_url);

  const { error } = await sb.from("projets").delete().eq("id", id);
  if (error) alert("Erreur : " + error.message);
  await loadProjets();
}

// ---------- Documents ----------
async function loadDocs() {
  const projetId = $("#doc-projet").value;
  const list = $("#docs-list");
  if (!projetId) {
    list.innerHTML = '<li class="empty">Crée d\'abord un projet.</li>';
    return;
  }
  const { data, error } = await sb.from("documents").select("*").eq("projet_id", projetId).order("created_at");
  if (error) {
    list.innerHTML = `<li class="alert">${esc(error.message)}</li>`;
    return;
  }
  list.innerHTML = data.length
    ? data.map((d) => `
      <li class="doc-item">
        <div class="doc-icon">${fileIcon(d.type, d.nom)}</div>
        <div class="doc-info"><strong title="${esc(d.nom)}">${esc(d.nom)}</strong><span class="meta">${formatSize(d.taille)} · ajouté le ${new Date(d.created_at).toLocaleDateString("fr-FR")}</span></div>
        <button class="btn btn-sm btn-ghost" data-open="${esc(d.chemin)}">Voir</button>
        <button class="btn btn-sm btn-danger" data-deldoc="${d.id}" data-chemin="${esc(d.chemin)}">Supprimer</button>
      </li>`).join("")
    : '<li class="empty">Aucun document pour ce projet.</li>';

  list.querySelectorAll("[data-open]").forEach((b) => (b.onclick = () => openDocument(b.dataset.open)));
  list.querySelectorAll("[data-deldoc]").forEach((b) => (b.onclick = async () => {
    if (!confirm("Supprimer ce document ?")) return;
    await sb.storage.from("documents").remove([b.dataset.chemin]);
    await sb.from("documents").delete().eq("id", b.dataset.deldoc);
    loadDocs();
    loadProjets();
  }));
}

$("#doc-projet").addEventListener("change", loadDocs);

async function uploadDocs(files) {
  const projetId = $("#doc-projet").value;
  const msg = $("#docs-msg");
  if (!projetId) return;

  let ok = 0;
  const erreurs = [];
  for (const [i, file] of [...files].entries()) {
    msg.innerHTML = `<p class="meta">Envoi ${i + 1}/${files.length} : ${esc(file.name)}…</p>`;
    const chemin = `projet-${projetId}/${Date.now()}-${slug(file.name)}`;
    const { error } = await sb.storage.from("documents").upload(chemin, file, { contentType: file.type || undefined });
    if (error) { erreurs.push(`${file.name} : ${error.message}`); continue; }

    const { error: e2 } = await sb.from("documents").insert({
      projet_id: +projetId, nom: file.name, chemin, type: file.type, taille: file.size,
    });
    if (e2) { erreurs.push(`${file.name} : ${e2.message}`); await sb.storage.from("documents").remove([chemin]); continue; }
    ok++;
  }
  msg.innerHTML =
    (ok ? `<p class="alert ok">${ok} fichier(s) ajouté(s).</p>` : "") +
    (erreurs.length ? `<p class="alert">${erreurs.map(esc).join("<br>")}</p>` : "");
  $("#doc-files").value = "";
  loadDocs();
  loadProjets();
}

$("#doc-files").addEventListener("change", (e) => e.target.files.length && uploadDocs(e.target.files));
const dz = $("#dropzone");
["dragenter", "dragover"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add("over"); }));
["dragleave", "drop"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove("over"); }));
dz.addEventListener("drop", (e) => e.dataTransfer.files.length && uploadDocs(e.dataTransfer.files));
