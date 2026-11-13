// Tableau de synthèse E5 : lecture pour tous, édition directe pour l'admin
const SECTIONS = [
  { key: "formation", label: "Réalisations en cours de formation", rows: [9, 18] },
  { key: "annee1", label: "Réalisations en milieu professionnel en cours de première année", rows: [20, 26] },
  { key: "annee2", label: "Réalisations en milieu professionnel en cours de seconde année", rows: [28, 35] },
];
const CODES = ["B1.1", "B1.2", "B1.3", "B1.4", "B1.5", "B1.6"];
const COLS_XLSX = ["C", "D", "E", "F", "G", "H"]; // colonnes du modèle officiel
const DETAILS = {
  "B1.1": "Recenser et identifier les ressources numériques · Exploiter des référentiels, normes et standards · Mettre en place et vérifier les niveaux d'habilitation · Vérifier les conditions de la continuité d'un service · Gérer des sauvegardes · Vérifier le respect des règles d'utilisation des ressources numériques",
  "B1.2": "Collecter, suivre et orienter des demandes · Traiter des demandes concernant les services réseau et système, applicatifs · Traiter des demandes concernant les applications",
  "B1.3": "Participer à la valorisation de l'image de l'organisation sur les médias numériques · Référencer les services en ligne et mesurer leur visibilité · Participer à l'évolution d'un site Web",
  "B1.4": "Analyser les objectifs et les modalités d'organisation d'un projet · Planifier les activités · Évaluer les indicateurs de suivi et analyser les écarts",
  "B1.5": "Réaliser les tests d'intégration et d'acceptation d'un service · Déployer un service · Accompagner les utilisateurs",
  "B1.6": "Mettre en place son environnement d'apprentissage personnel · Mettre en œuvre des outils et stratégies de veille · Gérer son identité professionnelle · Développer son projet professionnel",
};
const SHORT = {
  "B1.1": "Gérer le patrimoine informatique",
  "B1.2": "Répondre aux incidents et demandes",
  "B1.3": "Présence en ligne de l'organisation",
  "B1.4": "Travailler en mode projet",
  "B1.5": "Mettre à disposition un service",
  "B1.6": "Développement professionnel",
};

let isAdmin = false;
let lignes = [];
let projets = [];
let infos = null;

const $ = (s) => document.querySelector(s);

(async () => {
  const user = await initNav();
  isAdmin = user?.role === "admin";
  if (!CONFIG_OK) {
    $("#tableau").innerHTML = '<p class="empty" style="padding:16px">Configure Supabase pour afficher le tableau.</p>';
    return;
  }
  if (isAdmin) {
    const b = $("#btn-xlsx");
    b.hidden = false;
    b.onclick = exportXlsx;
  }
  await load();
})();

async function load() {
  const [l, p, i] = await Promise.all([
    sb.from("synthese_lignes").select("*").order("ordre").order("id"),
    sb.from("projets").select("id, titre, competences").order("ordre"),
    sb.from("synthese_infos").select("*").eq("id", 1).maybeSingle(),
  ]);
  if (l.error) {
    $("#tableau").innerHTML = `<p class="alert" style="margin:16px">Impossible de charger le tableau : ${esc(l.error.message)}<br>As-tu exécuté <code>supabase/synthese.sql</code> dans Supabase ?</p>`;
    return;
  }
  lignes = l.data;
  projets = p.data || [];
  infos = i.data || null;
  renderInfos();
  renderTable();
}

// ---------- Format des dates ----------
function frDate(d) {
  if (!d) return "";
  const [y, m, j] = d.split("-");
  return `${j}/${m}/${y.slice(2)}`;
}
function periode(l) {
  if (l.date_debut && l.date_fin) return `du ${frDate(l.date_debut)} au ${frDate(l.date_fin)}`;
  if (l.date_debut) return `depuis le ${frDate(l.date_debut)}`;
  return "";
}

// ---------- En-tête ----------
function renderInfos() {
  const el = $("#infos");
  if (isAdmin) {
    const v = infos || {};
    el.innerHTML = `
      <div class="card no-print-border">
        <div class="infos-form">
          <div><label for="i-nom">NOM et prénom</label><input id="i-nom" value="${esc(v.nom || "")}"></div>
          <div><label for="i-num">N° candidat</label><input id="i-num" value="${esc(v.num_candidat || "")}"></div>
          <div><label for="i-centre">Centre de formation</label><input id="i-centre" value="${esc(v.centre || "")}"></div>
          <div><label for="i-session">Session</label><input id="i-session" value="${esc(v.session || "")}"></div>
          <div><label for="i-url">Adresse URL du portfolio</label><input id="i-url" value="${esc(v.url || location.origin + location.pathname.replace(/synthese\.html$/, ""))}"></div>
          <div><label>Option</label>
            <div class="radio-row">
              <label><input type="radio" name="i-opt" value="SISR" ${v.option !== "SLAM" ? "checked" : ""}> SISR</label>
              <label><input type="radio" name="i-opt" value="SLAM" ${v.option === "SLAM" ? "checked" : ""}> SLAM</label>
            </div>
          </div>
        </div>
        <div class="add-bar no-print"><button class="btn btn-sm" id="i-save">Enregistrer l'en-tête</button><span class="saved" id="i-msg"></span></div>
      </div><br>`;
    $("#i-save").onclick = saveInfos;
    return;
  }
  if (!infos) { el.innerHTML = ""; return; }
  el.innerHTML = `
    <div class="infos">
      <div><span>NOM et prénom :</span> ${esc(infos.nom || "")}</div>
      <div><span>N° candidat :</span> ${esc(infos.num_candidat || "")}</div>
      <div><span>Centre de formation :</span> ${esc(infos.centre || "")}</div>
      <div><span>Option :</span> ${esc(infos.option || "")} · <span>Session</span> ${esc(infos.session || "")}</div>
      <div><span>Portfolio :</span> <a href="${esc(infos.url || "#")}">${esc(infos.url || "")}</a></div>
    </div>`;
}

async function saveInfos() {
  const msg = $("#i-msg");
  const payload = {
    id: 1,
    nom: $("#i-nom").value.trim(),
    num_candidat: $("#i-num").value.trim(),
    centre: $("#i-centre").value.trim(),
    session: $("#i-session").value.trim(),
    url: $("#i-url").value.trim(),
    option: document.querySelector('input[name="i-opt"]:checked').value,
  };
  const { error } = await sb.from("synthese_infos").upsert(payload);
  if (error) { msg.textContent = "Erreur : " + error.message; return; }
  infos = payload;
  msg.textContent = "Enregistré ✓";
  setTimeout(() => (msg.textContent = ""), 2500);
}

// ---------- Tableau ----------
function renderTable() {
  const head = `
    <colgroup><col class="c-real"><col class="c-per">${CODES.map(() => "<col>").join("")}${isAdmin ? '<col class="c-adm">' : ""}</colgroup>
    <thead><tr>
      <th>Réalisations professionnelles<br><span style="font-weight:400">(intitulé et liste des documents et productions associés)</span></th>
      <th>Période</th>
      ${CODES.map((c) => `<th class="comp" title="${esc(DETAILS[c])}"><b>${c}</b>${esc(SHORT[c])}</th>`).join("")}
      ${isAdmin ? "<th></th>" : ""}
    </tr></thead>`;

  const nbCols = 2 + CODES.length + (isAdmin ? 1 : 0);
  let body = "";
  for (const s of SECTIONS) {
    const rows = lignes.filter((l) => l.section === s.key);
    const max = s.rows[1] - s.rows[0] + 1;
    body += `<tr class="section"><td colspan="${nbCols}">${esc(s.label)}${isAdmin ? `<span class="count">${rows.length} / ${max} lignes dans le modèle officiel</span>` : ""}</td></tr>`;
    if (!rows.length && !isAdmin) body += `<tr><td colspan="${nbCols}" class="empty">—</td></tr>`;
    body += rows.map((l, idx) => (isAdmin ? rowEdit(l, idx, rows.length) : rowView(l))).join("");
    if (isAdmin) {
      body += `<tr class="add no-print"><td colspan="${nbCols}">
        <div class="add-bar">
          <button class="btn btn-ghost btn-sm" data-add="${s.key}">+ Ligne vide</button>
          <select data-addfrom="${s.key}">
            <option value="">+ Ajouter depuis un projet…</option>
            ${projets.map((p) => `<option value="${p.id}">${esc(p.titre)}</option>`).join("")}
          </select>
        </div></td></tr>`;
    }
  }

  $("#tableau").innerHTML = `<table class="e5">${head}<tbody>${body}</tbody></table>`;
  if (isAdmin) bindAdmin();
}

function rowView(l) {
  const titre = l.projet_id
    ? `<a href="projet.html?id=${l.projet_id}"><strong>${esc(l.intitule || "")}</strong></a>`
    : `<strong>${esc(l.intitule || "")}</strong>`;
  return `<tr>
    <td>${titre}${l.documents ? `<div class="docs">${esc(l.documents)}</div>` : ""}</td>
    <td class="per">${esc(periode(l))}</td>
    ${CODES.map((c) => `<td class="ck">${(l.competences || []).includes(c) ? "✓" : ""}</td>`).join("")}
  </tr>`;
}

function rowEdit(l, idx, total) {
  return `<tr data-id="${l.id}">
    <td>
      <input type="text" class="f-titre" placeholder="Intitulé de la réalisation" value="${esc(l.intitule || "")}">
      <textarea class="f-docs" placeholder="Documents et productions associés (un par ligne)">${esc(l.documents || "")}</textarea>
      <select class="f-projet">
        <option value="">Projet du portfolio lié : aucun</option>
        ${projets.map((p) => `<option value="${p.id}" ${p.id === l.projet_id ? "selected" : ""}>${esc(p.titre)}</option>`).join("")}
      </select>
      <div class="saved"></div>
    </td>
    <td><div class="per-edit">
      <small>Du</small><input type="date" class="f-debut" value="${l.date_debut || ""}">
      <small>Au</small><input type="date" class="f-fin" value="${l.date_fin || ""}">
    </div></td>
    ${CODES.map((c) => `<td class="ck"><input type="checkbox" class="f-comp" value="${c}" title="${c} — ${esc(SHORT[c])}" ${(l.competences || []).includes(c) ? "checked" : ""}></td>`).join("")}
    <td><div class="row-tools">
      <button class="btn btn-ghost btn-sm" data-move="-1" title="Monter" ${idx === 0 ? "disabled" : ""}>↑</button>
      <button class="btn btn-ghost btn-sm" data-move="1" title="Descendre" ${idx === total - 1 ? "disabled" : ""}>↓</button>
      <button class="btn btn-danger btn-sm" data-del title="Supprimer">✕</button>
    </div></td>
  </tr>`;
}

// ---------- Édition (admin) ----------
function bindAdmin() {
  const table = $("#tableau");

  table.querySelectorAll("tr[data-id]").forEach((tr) => {
    tr.addEventListener("change", () => saveRow(tr));
    tr.querySelector("[data-del]").onclick = () => deleteRow(+tr.dataset.id);
    tr.querySelectorAll("[data-move]").forEach((b) => (b.onclick = () => moveRow(+tr.dataset.id, +b.dataset.move)));
  });

  table.querySelectorAll("[data-add]").forEach((b) => (b.onclick = () => addRow(b.dataset.add)));
  table.querySelectorAll("[data-addfrom]").forEach((sel) =>
    sel.addEventListener("change", () => {
      const p = projets.find((x) => String(x.id) === sel.value);
      if (p) addRow(sel.dataset.addfrom, { intitule: p.titre, competences: p.competences || [], projet_id: p.id });
    })
  );
}

async function saveRow(tr) {
  const id = +tr.dataset.id;
  const msg = tr.querySelector(".saved");
  const payload = {
    intitule: tr.querySelector(".f-titre").value.trim() || null,
    documents: tr.querySelector(".f-docs").value.trim() || null,
    projet_id: tr.querySelector(".f-projet").value ? +tr.querySelector(".f-projet").value : null,
    date_debut: tr.querySelector(".f-debut").value || null,
    date_fin: tr.querySelector(".f-fin").value || null,
    competences: [...tr.querySelectorAll(".f-comp:checked")].map((c) => c.value),
  };
  msg.textContent = "Enregistrement…";
  const { error } = await sb.from("synthese_lignes").update(payload).eq("id", id);
  if (error) { msg.textContent = "Erreur : " + error.message; return; }
  Object.assign(lignes.find((l) => l.id === id), payload);
  msg.textContent = "Enregistré ✓";
  setTimeout(() => { if (msg.textContent === "Enregistré ✓") msg.textContent = ""; }, 2000);
}

async function addRow(section, data = {}) {
  const same = lignes.filter((l) => l.section === section);
  const ordre = same.length ? Math.max(...same.map((l) => l.ordre || 0)) + 1 : 1;
  const { error } = await sb.from("synthese_lignes").insert({ section, ordre, competences: [], ...data });
  if (error) { alert("Erreur : " + error.message); return; }
  await load();
}

async function deleteRow(id) {
  if (!confirm("Supprimer cette ligne du tableau ?")) return;
  const { error } = await sb.from("synthese_lignes").delete().eq("id", id);
  if (error) { alert("Erreur : " + error.message); return; }
  await load();
}

async function moveRow(id, dir) {
  const l = lignes.find((x) => x.id === id);
  const same = lignes.filter((x) => x.section === l.section);
  const i = same.indexOf(l);
  const other = same[i + dir];
  if (!other) return;
  // On renumérote toute la section pour éviter les ordres en double
  same.splice(i, 1);
  same.splice(i + dir, 0, l);
  const results = await Promise.all(same.map((x, k) => sb.from("synthese_lignes").update({ ordre: k + 1 }).eq("id", x.id)));
  const err = results.find((r) => r.error);
  if (err) alert("Erreur : " + err.error.message);
  await load();
}

// ---------- Export vers le modèle officiel (.xlsx) ----------
function loadScript(src) {
  return new Promise((ok, ko) => {
    if (window.ExcelJS) return ok();
    const s = document.createElement("script");
    s.src = src;
    s.onload = ok;
    s.onerror = () => ko(new Error("Impossible de charger ExcelJS"));
    document.head.appendChild(s);
  });
}

async function exportXlsx() {
  const btn = $("#btn-xlsx");
  btn.disabled = true;
  try {
    await loadScript("https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js");
    const res = await fetch("modele-synthese-e5.xlsx");
    if (!res.ok) throw new Error("Fichier modele-synthese-e5.xlsx introuvable à la racine du site");
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(await res.arrayBuffer());
    const ws = wb.worksheets[0];
    const v = infos || {};

    if (v.session) ws.getCell("G1").value = "SESSION " + v.session;
    ws.getCell("A3").value = "NOM et prénom : " + (v.nom || "");
    ws.getCell("F3").value = "N° candidat : " + (v.num_candidat || "");
    ws.getCell("A4").value = "Centre de formation : " + (v.centre || "");
    ws.getCell("G4").value = (v.option === "SLAM" ? "▢" : "☒") + " SISR";
    ws.getCell("H4").value = (v.option === "SLAM" ? "☒" : "▢") + " SLAM";
    ws.getCell("A5").value = "Adresse URL du portfolio : " + (v.url || "");

    const debordements = [];
    for (const s of SECTIONS) {
      const rows = lignes.filter((l) => l.section === s.key);
      for (let r = s.rows[0]; r <= s.rows[1]; r++) ["A", "B", ...COLS_XLSX].forEach((c) => (ws.getCell(c + r).value = null));
      rows.forEach((l, i) => {
        const r = s.rows[0] + i;
        if (r > s.rows[1]) { debordements.push(l.intitule || "(sans titre)"); return; }
        const a = ws.getCell("A" + r);
        a.value = [l.intitule, l.documents].filter(Boolean).join("\n");
        a.alignment = { ...(a.alignment || {}), wrapText: true, vertical: "top" };
        const b = ws.getCell("B" + r);
        b.value = periode(l).replace(/^du /, "");
        b.alignment = { ...(b.alignment || {}), wrapText: true, vertical: "top" };
        COLS_XLSX.forEach((col, k) => {
          const c = ws.getCell(col + r);
          c.value = (l.competences || []).includes(CODES[k]) ? "X" : null;
          c.alignment = { ...(c.alignment || {}), horizontal: "center", vertical: "middle" };
        });
      });
    }

    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "E5_Tableau_de_synthese" + (v.nom ? "_" + slug(v.nom) : "") + ".xlsx";
    a.click();
    URL.revokeObjectURL(a.href);

    if (debordements.length) {
      alert("Le modèle officiel n'a pas assez de lignes pour : \n- " + debordements.join("\n- ") + "\n\nAjoute ces lignes à la main dans le fichier Excel.");
    }
  } catch (e) {
    alert("Export impossible : " + e.message);
  } finally {
    btn.disabled = false;
  }
}
