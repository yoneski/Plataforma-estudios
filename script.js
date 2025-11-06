// ========== FUNCIONES BÁSICAS ==========
function leerLS(clave) {
  return JSON.parse(localStorage.getItem(clave)) || [];
}

function guardarLS(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function crearElemento(tag, clase, texto) {
  const el = document.createElement(tag);
  if (clase) el.className = clase;
  if (texto) el.textContent = texto;
  return el;
}

function notificar(mensaje, tipo = "ok") {
  const aviso = document.createElement("div");
  aviso.textContent = mensaje;
  aviso.className = `notificacion ${tipo}`;
  document.body.appendChild(aviso);
  setTimeout(() => aviso.remove(), 2500);
}

// ========== PLAN DE ESTUDIO ==========
function gestorPlan() {
  const form = document.getElementById("formPlan");
  const lista = document.getElementById("listaPlan");
  let plan = leerLS("planEstudio");
  render();

  form.addEventListener("submit", e => {
    e.preventDefault();
    const tema = document.getElementById("tema").value.trim();
    const progreso = parseInt(document.getElementById("progresoTema").value.trim());
    if (!tema || isNaN(progreso)) {
      notificar("Completa los campos correctamente", "error");
      return;
    }
    plan.push({ tema, progreso });
    guardarLS("planEstudio", plan);
    form.reset();
    render();
    actualizarSelectoresTemas();
    notificar("Tema agregado al plan 📘", "ok");
  });

  function render() {
    lista.innerHTML = "";
    plan.forEach((t, i) => {
      const li = crearElemento("li", "tema-item");
      li.innerHTML = `
        <strong>${t.tema}</strong> - ${t.progreso}%
      `;
      const btnDel = crearElemento("button", "delete", "Eliminar");
      btnDel.onclick = () => {
        if (confirm("¿Eliminar este tema?")) {
          plan.splice(i, 1);
          guardarLS("planEstudio", plan);
          render();
          actualizarSelectoresTemas();
        }
      };
      li.onclick = () => abrirTema(t.tema);
      li.appendChild(btnDel);
      lista.appendChild(li);
    });
  }
}

// ========== ACTUALIZAR SELECTORES ==========
function actualizarSelectoresTemas() {
  const temas = leerLS("planEstudio") || [];
  const selects = [
    document.getElementById("temaRelacionadoBiblio"),
    document.getElementById("temaRelacionadoEnlace"),
    document.getElementById("temaRelacionadoArchivo")
  ].filter(Boolean);

  selects.forEach(sel => {
    sel.innerHTML = '<option value="">Seleccionar tema relacionado</option>';
    temas.forEach(t => {
      const op = document.createElement("option");
      op.value = t.tema;
      op.textContent = t.tema;
      sel.appendChild(op);
    });
  });
}

// ========== BIBLIOGRAFÍA ==========
function gestorBiblio() {
  const form = document.getElementById("formBiblio");
  const lista = document.getElementById("listaBiblio");
  let biblio = leerLS("bibliografia");
  render();

  form.addEventListener("submit", e => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const temaRelacionado = document.getElementById("temaRelacionadoBiblio").value;
    if (!titulo || !autor) return notificar("Completa todos los campos", "error");
    biblio.push({ titulo, autor, temaRelacionado });
    guardarLS("bibliografia", biblio);
    form.reset();
    render();
    notificar("Bibliografía agregada 📚", "ok");
  });

  function render() {
    lista.innerHTML = "";
    biblio.forEach((b, i) => {
      const li = crearElemento("li", "biblio-item", `${b.titulo} - ${b.autor} (${b.temaRelacionado || "Sin tema"})`);
      const btnDel = crearElemento("button", "delete", "Eliminar");
      btnDel.onclick = () => {
        if (confirm("¿Eliminar esta bibliografía?")) {
          biblio.splice(i, 1);
          guardarLS("bibliografia", biblio);
          render();
        }
      };
      li.appendChild(btnDel);
      lista.appendChild(li);
    });
  }
}

// ========== ENLACES ==========
function gestorEnlaces() {
  const form = document.getElementById("formEnlace");
  const lista = document.getElementById("listaEnlaces");
  let enlaces = leerLS("enlaces");
  render();

  form.addEventListener("submit", e => {
    e.preventDefault();
    const url = document.getElementById("url").value.trim();
    const temaRelacionado = document.getElementById("temaRelacionadoEnlace").value;
    if (!url.startsWith("http")) return notificar("URL inválida", "error");
    enlaces.push({ url, temaRelacionado });
    guardarLS("enlaces", enlaces);
    form.reset();
    render();
    notificar("Enlace guardado 🔗", "ok");
  });

  function render() {
    lista.innerHTML = "";
    enlaces.forEach((e, i) => {
      const li = crearElemento("li", "enlace-item");
      li.innerHTML = `<a href="${e.url}" target="_blank">${e.url}</a> (${e.temaRelacionado || "Sin tema"})`;
      const btnDel = crearElemento("button", "delete", "Eliminar");
      btnDel.onclick = () => {
        if (confirm("¿Eliminar este enlace?")) {
          enlaces.splice(i, 1);
          guardarLS("enlaces", enlaces);
          render();
        }
      };
      li.appendChild(btnDel);
      lista.appendChild(li);
    });
  }
}

// ========== ARCHIVOS ==========
function gestorArchivos() {
  const form = document.getElementById("formArchivo");
  const lista = document.getElementById("listaArchivos");
  let archivos = leerLS("archivos");
  render();

  form.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = document.getElementById("nombreArchivo").value.trim();
    const temaRelacionado = document.getElementById("temaRelacionadoArchivo").value;
    if (!nombre) return notificar("Completa el nombre del archivo", "error");
    archivos.push({ nombre, temaRelacionado });
    guardarLS("archivos", archivos);
    form.reset();
    render();
    notificar("Archivo agregado 🖼️", "ok");
  });

  function render() {
    lista.innerHTML = "";
    archivos.forEach((a, i) => {
      const li = crearElemento("li", "archivo-item", `${a.nombre} (${a.temaRelacionado || "Sin tema"})`);
      const btnDel = crearElemento("button", "delete", "Eliminar");
      btnDel.onclick = () => {
        if (confirm("¿Eliminar este archivo?")) {
          archivos.splice(i, 1);
          guardarLS("archivos", archivos);
          render();
        }
      };
      li.appendChild(btnDel);
      lista.appendChild(li);
    });
  }
}

// ========== NOTAS PERSONALES ==========
function gestorNotas() {
  const form = document.getElementById("formNota");
  const lista = document.getElementById("listaNotas");
  let notas = leerLS("notasPersonales");
  render();

  form.addEventListener("submit", e => {
    e.preventDefault();
    const texto = document.getElementById("notaTexto").value.trim();
    if (!texto) return notificar("Escribe una nota antes de guardar", "error");
    const fecha = new Date().toLocaleString();
    notas.unshift({ texto, fecha });
    guardarLS("notasPersonales", notas);
    form.reset();
    render();
    notificar("Nota guardada 📝", "ok");
  });

  function render() {
    lista.innerHTML = "";
    notas.forEach((nota, i) => {
      const li = crearElemento("li", "nota-item");
      li.innerHTML = `
        <div class="nota-texto">${nota.texto}</div>
        <small>${nota.fecha}</small>
      `;
      const btnDel = crearElemento("button", "delete", "Eliminar");
      btnDel.onclick = () => {
        if (confirm("¿Eliminar esta nota?")) {
          notas.splice(i, 1);
          guardarLS("notasPersonales", notas);
          render();
        }
      };
      li.appendChild(btnDel);
      lista.appendChild(li);
    });
  }
}

// ========== VISTA DE TEMA ==========
function abrirTema(temaNombre) {
  const plan = leerLS("planEstudio") || [];
  const biblio = leerLS("bibliografia") || [];
  const enlaces = leerLS("enlaces") || [];
  const archivos = leerLS("archivos") || [];

  const tema = plan.find(t => t.tema === temaNombre);
  if (!tema) return;

  document.getElementById("plan").style.display = "none";
  document.getElementById("vistaTema").style.display = "block";

  const vista = document.getElementById("contenidoTemaVista");
  document.getElementById("tituloTemaVista").textContent = `📘 ${tema.tema}`;

  const biblioRelacionada = biblio.filter(b => b.temaRelacionado === tema.tema);
  const enlacesRelacionados = enlaces.filter(e => e.temaRelacionado === tema.tema);
  const archivosRelacionados = archivos.filter(a => a.temaRelacionado === tema.tema);

  vista.innerHTML = `
    <p><strong>Progreso:</strong> ${tema.progreso || 0}%</p>
    <h3>📚 Bibliografía</h3>
    <ul>${biblioRelacionada.map(b => `<li>${b.titulo} (${b.autor})</li>`).join('') || '<li>Sin registros</li>'}</ul>
    <h3>🔗 Enlaces</h3>
    <ul>${enlacesRelacionados.map(e => `<li><a href="${e.url}" target="_blank">${e.url}</a></li>`).join('') || '<li>Sin registros</li>'}</ul>
    <h3>🖼️ Archivos</h3>
    <ul>${archivosRelacionados.map(a => `<li>${a.nombre}</li>`).join('') || '<li>Sin archivos</li>'}</ul>
  `;
}

document.getElementById("volverAPlan").onclick = () => {
  document.getElementById("plan").style.display = "block";
  document.getElementById("vistaTema").style.display = "none";
};

// ========== GRÁFICO DE PROGRESO GENERAL ==========
function graficos() {
  const ctx = document.getElementById("graficoProgreso");
  if (!ctx) return;
  const plan = leerLS("planEstudio") || [];
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: plan.map(p => p.tema),
      datasets: [{
        label: "Progreso (%)",
        data: plan.map(p => p.progreso),
        backgroundColor: "rgba(54,162,235,0.6)"
      }]
    },
    options: { scales: { y: { beginAtZero: true } } }
  });
}

// ========== INICIO ==========
document.addEventListener("DOMContentLoaded", () => {
  gestorPlan();
  gestorBiblio();
  gestorEnlaces();
  gestorArchivos();
  gestorNotas();
  actualizarSelectoresTemas();
  graficos();
});