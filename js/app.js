// Fonctions communes à toutes les pages
const CONFIG_OK = !window.CONFIG.SUPABASE_URL.includes("VOTRE-PROJET");
const sb = window.supabase.createClient(
  CONFIG_OK ? window.CONFIG.SUPABASE_URL : "https://exemple.supabase.co",
  window.CONFIG.SUPABASE_ANON_KEY
);

// Compétences du bloc 1 du BTS SIO (référentiel commun SISR/SLAM)
const COMPETENCES = {
  "B1.1": "Gérer le patrimoine informatique",
  "B1.2": "Répondre aux incidents et aux demandes d'assistance et d'évolution",
  "B1.3": "Développer la présence en ligne de l'organisation",
  "B1.4": "Travailler en mode projet",
  "B1.5": "Mettre à disposition des utilisateurs un service informatique",
  "B1.6": "Organiser son développement professionnel",
};

function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

function formatSize(o) {
  if (!o) return "";
  if (o < 1024) return o + " o";
  if (o < 1048576) return (o / 1024).toFixed(0) + " Ko";
  return (o / 1048576).toFixed(1) + " Mo";
}

function slug(name) {
  return name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9._-]/g, "_");
}

function fileIcon(type = "", nom = "") {
  const ext = nom.split(".").pop().toLowerCase();
  if (type.includes("pdf") || ext === "pdf") return "PDF";
  if (type.startsWith("image/")) return "IMG";
  if (["doc", "docx", "odt"].includes(ext)) return "DOC";
  if (["xls", "xlsx", "ods", "csv"].includes(ext)) return "XLS";
  if (["zip", "rar", "7z"].includes(ext)) return "ZIP";
  if (["txt", "conf", "cfg", "sh", "ps1", "md"].includes(ext)) return "TXT";
  return "FIC";
}

async function currentUser() {
  if (!CONFIG_OK) return null;
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return null;
  const { data } = await sb.from("profiles").select("role, nom").eq("id", session.user.id).single();
  return { ...session.user, role: data?.role || "examinateur", nom: data?.nom };
}

async function initNav() {
  if (!CONFIG_OK) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<div class="config-banner">Supabase n\'est pas encore configuré : renseigne <code>js/config.js</code> (voir README).</div>'
    );
  }
  const user = await currentUser();
  const el = document.getElementById("nav-auth");
  if (el) {
    if (user) {
      el.innerHTML = `
        ${user.role === "admin" ? '<a href="admin.html">Administration</a>' : ""}
        <span class="nav-user" title="${esc(user.email)}">${user.role === "admin" ? "Admin" : "Examinateur"}</span>
        <button class="btn btn-sm btn-ghost" id="logout">Déconnexion</button>`;
      document.getElementById("logout").onclick = async () => {
        await sb.auth.signOut();
        location.href = "index.html";
      };
    } else {
      el.innerHTML = '<a class="btn btn-sm" href="login.html">Connexion</a>';
    }
  }
  return user;
}

// Ouvre un document privé via une URL signée valable 10 minutes
async function openDocument(chemin) {
  const win = window.open("", "_blank"); // ouvert tout de suite pour éviter le bloqueur de pop-up
  const { data, error } = await sb.storage.from("documents").createSignedUrl(chemin, 600);
  if (error) {
    win?.close();
    alert("Impossible d'ouvrir le document : " + error.message);
    return;
  }
  if (win) win.location = data.signedUrl;
  else location.href = data.signedUrl;
}
