// ===============================
// VARIABLES Y DATOS
// ===============================
let planes = JSON.parse(localStorage.getItem("planes")) || [];
let bibliografias = JSON.parse(localStorage.getItem("bibliografias")) || [];
let enlaces = JSON.parse(localStorage.getItem("enlaces")) || [];

// ===============================
// ELEMENTOS DEL DOM
// ===============================
const formPlan = document.getElementById("formPlan");
const listaPlan = document.getElementById("listaPlan");
const formBiblio = document.getElementById("formBiblio");
const listaBiblio = document.getElementById("listaBiblio");
const formEnlace = document.getElementById("formEnlace");
const listaEnlaces = document.getElementById("listaEnlaces");

// ===============================
// FUNCIONES PARA LOCALSTORAGE
// ===============================
function guardarLocal() {
  localStorage.setItem("planes", JSON.stringify(planes));
  localStorage.setItem("bibliografias", JSON.stringify(bibliografias));
  localStorage.setItem("enlaces", JSON.stringify(enlaces));
}

// ===============================
// FUNCIONES PARA LISTAS DINÁMICAS
// ===============================
function mostrarPlanes() {
  listaPlan.innerHTML = "";
  planes.forEach((p, index) => {
    const li = document.createElement("li");
    li.textContent = `${p.tema} - ${p.progreso}%`;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.onclick = () => {
      planes.splice(index, 1);
      guardarLocal();
      mostrarPlanes();
      actualizarGraficos();
    };

    li.appendChild(btnEliminar);
    listaPlan.appendChild(li);
  });
}

function mostrarBibliografias() {
  listaBiblio.innerHTML = "";
  bibliografias.forEach((b, index) => {
    const li = document.createElement("li");
    li.textContent = `${b.titulo} - ${b.autor}`;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.onclick = () => {
      bibliografias.splice(index, 1);
      guardarLocal();
      mostrarBibliografias();
    };

    li.appendChild(btnEliminar);
    listaBiblio.appendChild(li);
  });
}

function mostrarEnlaces() {
  listaEnlaces.innerHTML = "";
  enlaces.forEach((e, index) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = e.url;
    a.target = "_blank";
    a.textContent = e.url;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.onclick = () => {
      enlaces.splice(index, 1);
      guardarLocal();
      mostrarEnlaces();
    };

    li.appendChild(a);
    li.appendChild(btnEliminar);
    listaEnlaces.appendChild(li);
  });
}

// ===============================
// EVENTOS DE FORMULARIOS
// ===============================
formPlan.addEventListener("submit", (e) => {
  e.preventDefault();
  const tema = document.getElementById("tema").value;
  const progreso = parseInt(document.getElementById("progresoTema").value);

  planes.push({ tema, progreso });
  guardarLocal();
  mostrarPlanes();
  actualizarGraficos();
  formPlan.reset();
});

formBiblio.addEventListener("submit", (e) => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;

  bibliografias.push({ titulo, autor });
  guardarLocal();
  mostrarBibliografias();
  formBiblio.reset();
});

formEnlace.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = document.getElementById("url").value;

  enlaces.push({ url });
  guardarLocal();
  mostrarEnlaces();
  formEnlace.reset();
});

// ===============================
// GRÁFICOS CON CHART.JS
// ===============================
const ctx = document.getElementById("graficoProgreso").getContext("2d");
const grafico = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [{ label: "% Completado", data: [], backgroundColor: [] }]
  },
  options: { responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }
});

const ctxPromedio = document.getElementById("graficoPromedio").getContext("2d");
const graficoPromedio = new Chart(ctxPromedio, {
  type: "doughnut",
  data: { labels: ["Promedio", "Restante"], datasets: [{ data: [0, 100], backgroundColor: ["#28a745", "#d0d8e4"] }] },
  options: { responsive: true, cutout: "70%" }
});

const ctxLinea = document.getElementById("graficoLinea").getContext("2d");
const graficoLinea = new Chart(ctxLinea, {
  type: "line",
  data: { labels: [], datasets: [{ label: "Promedio Evolución", data: [], borderColor: "#3a6fb0", fill: false }] },
  options: { responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }
});

// ===============================
// FUNCION PARA ACTUALIZAR GRÁFICOS
// ===============================
function actualizarGraficos() {
  // BARRA
  grafico.data.labels = planes.map(p => p.tema);
  grafico.data.datasets[0].data = planes.map(p => p.progreso);
  grafico.data.datasets[0].backgroundColor = planes.map(p =>
    p.progreso >= 80 ? "#28a745" : p.progreso >= 50 ? "#ffc107" : "#dc3545"
  );
  grafico.update();

  // PROMEDIO GENERAL
  if (planes.length > 0) {
    const promedio = planes.reduce((a, b) => a + b.progreso, 0) / planes.length;
    graficoPromedio.data.datasets[0].data = [promedio, 100 - promedio];
    graficoPromedio.data.datasets[0].backgroundColor = [promedio >= 80 ? "#28a745" : promedio >= 50 ? "#ffc107" : "#dc3545", "#d0d8e4"];
    graficoPromedio.update();

    // LINEA EVOLUCIÓN
    graficoLinea.data.labels.push(`Tema ${planes.length}`);
    graficoLinea.data.datasets[0].data.push(promedio);
    graficoLinea.data.datasets[0].borderColor = promedio >= 80 ? "#28a745" : promedio >= 50 ? "#ffc107" : "#dc3545";
    graficoLinea.update();
  }
}

// ===============================
// INICIALIZAR
// ===============================
mostrarPlanes();
mostrarBibliografias();
mostrarEnlaces();
actualizarGraficos();

// ===============================
// SIDEBAR RESPONSIVE
// ===============================
const btnToggle = document.getElementById("btn-toggle");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("main-content");

btnToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  mainContent.classList.toggle("shifted");
});

// ===============================
// ARCHIVOS Y FOTOS (GALERÍA)
// ===============================
const formArchivos = document.getElementById("formArchivos");
const archivoInput = document.getElementById("archivoInput");
const galeriaArchivos = document.getElementById("galeriaArchivos");

let archivos = JSON.parse(localStorage.getItem("archivos")) || [];

function mostrarArchivos() {
  galeriaArchivos.innerHTML = "";
  archivos.forEach((file, index) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-archivo";

    if(file.tipo.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = file.data;
      tarjeta.appendChild(img);
    }

    const nombre = document.createElement("span");
    nombre.textContent = file.nombre;
    tarjeta.appendChild(nombre);

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.onclick = () => {
      archivos.splice(index, 1);
      localStorage.setItem("archivos", JSON.stringify(archivos));
      mostrarArchivos();
    };
    tarjeta.appendChild(btnEliminar);

    galeriaArchivos.appendChild(tarjeta);
  });
}

formArchivos.addEventListener("submit", (e) => {
  e.preventDefault();
  const files = archivoInput.files;

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(event) {
      archivos.push({ nombre: file.name, tipo: file.type, data: event.target.result });
      localStorage.setItem("archivos", JSON.stringify(archivos));
      mostrarArchivos();
    };
    reader.readAsDataURL(file);
  });

  formArchivos.reset();
});

// INICIALIZAR GALERÍA
mostrarArchivos();