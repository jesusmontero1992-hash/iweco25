// =========================
// CONFIG
// =========================
const API_URL ="https://script.google.com/macros/s/AKfycbwylyQ64MrTjUz26kDQvWx2dC8gtecuvJvlLt0lueXyj9eRRLzbeDKRlqsSFsLfXQRbeA/exec";

// Año dinámico
document.getElementById("year").textContent = new Date().getFullYear();

// Elementos
const form = document.getElementById("formCert");
const salida = document.getElementById("resultado");
const inputCedula = document.getElementById("cedula");

// =============================
// VALIDACIÓN LOCAL DE CÉDULA
// =============================
function validarCedula(cedula) {
  const regex = /^\d{6,12}$/; // solo números 6–12 dígitos
  return regex.test(cedula);
}

// =============================
// CONSULTA AL SERVIDOR
// =============================

async function consultarCedula(cedula) {
  const url = `${API_URL}?cedula=${encodeURIComponent(cedula)}`;

  const res = await fetch(url); // ← SIN HEADERS

  let json;
  try {
    json = await res.json();
  } catch (e) {
    throw new Error("Respuesta del servidor no válida.");
  }

  if (!res.ok) {
    throw new Error(json.error || json.message || "Error desconocido");
  }

  return json;
}


// =============================
// EVENTO DE CONSULTA
// =============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cedula = inputCedula.value.trim();

  // Validación estricta local
  if (!validarCedula(cedula)) {
    salida.innerHTML =
      `<p style="color:red">⚠ Ingrese un número de cédula válido (6-12 dígitos).</p>`;
    return;
  }

  salida.innerHTML = `<p>Buscando certificado…</p>`;

  try {
    const data = await consultarCedula(cedula);

    if (!data.found) {
      salida.innerHTML =
        `<p><strong>No existe certificado para esta cédula.</strong></p>`;
      return;
    }

    renderCertificado(data);

  } catch (err) {
    salida.innerHTML = `<p style="color:red">⚠ ${err.message}</p>`;
  }
});

// =============================
// RENDER DEL CERTIFICADO
// =============================
function renderCertificado(d) {
  const hoy = new Date();
  const venc = new Date(d.fechaVencimiento);
  const estado = venc >= hoy ? "Activo" : "Vencido";

  const claseEstado = estado === "Activo" ? "estado-activo" : "estado-vencido";

  const botones =
    estado === "Activo"
      ? `
        <div class="acciones-cert">
          <button class="btn-accion btn-ver" data-pdf="${d.certificadoPDF}">
            Ver Certificado
          </button>
        </div>`
      : `
        <div class="acciones-cert">
          <button class="btn-accion btn-renovar" data-cedula="${d.cedula}">
            Renovar Certificado
          </button>
        </div>`;

  salida.innerHTML = `
    <article class="result-card" aria-label="Resultado del certificado">
      <section class="datos-box">

        <h3 class="visually-hidden">Datos del certificado</h3>

        <div class="resultado-grid">
          <div class="item">Nombre: <strong>${d.nombre}</strong></div>
          <div class="item">Apellido: <strong>${d.apellido}</strong></div>
          <div class="item">Cédula: <strong>${d.cedula}</strong></div>
          <div class="item">Oficio: <strong>${d.oficio}</strong></div>
          <div class="item">Ocupación: <strong>${d.ocupacion}</strong></div>
          <div class="item">N° Certificación: <strong>${d.nCertificacion}</strong></div>
          <div class="item">N° Carnet: <strong>${d.nCarnet}</strong></div>
          <div class="item">Clasificación: <strong>${d.clasificacion}</strong></div>
          <div class="item">Curso: <strong>${d.nombreCurso}</strong></div>
          <div class="item">Fecha Emisión: <strong>${d.fechaEmision}</strong></div>
          <div class="item">Fecha Vencimiento: <strong>${d.fechaVencimiento}</strong></div>
          <div class="item">Estado: 
            <strong class="${claseEstado}">${estado}</strong>
          </div>
        </div>

        ${botones}
      </section>

      <div class="qr-box">
        <img src="${d.qr}" alt="Código QR que apunta al certificado en PDF">
      </div>
    </article>
  `;
}

// =============================
// EVENT DELEGATION
// =============================
document.addEventListener("click", (e) => {
  // VER CERTIFICADO
  if (e.target.matches(".btn-ver")) {
    const url = e.target.dataset.pdf;
    vistaPreviaCertificado(url);
  }

  // RENOVAR
  if (e.target.matches(".btn-renovar")) {
    const cedula = e.target.dataset.cedula;
    alert("Renovación aún no implementada. Cédula: " + cedula);
  }
});

// =============================
// VISTA PREVIA DEL PDF
// =============================
function vistaPreviaCertificado(urlPDF) {
  if (!urlPDF) {
    alert("URL no válida.");
    return;
  }

  // Convertir siempre a preview
  urlPDF = urlPDF.replace("/view", "/preview");

  window.open("viewer.html?pdf=" + encodeURIComponent(urlPDF), "_blank");
}
