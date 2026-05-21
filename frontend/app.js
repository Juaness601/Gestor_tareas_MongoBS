const API = 'https://gestor-tareas-mongo-bs.vercel.app';
let token = localStorage.getItem('token') || null;

// ─── INIT ───────────────────────────────────────────────
window.onload = () => {
  if (token) mostrarApp();
  else mostrarAuth();
};

// ─── AUTH ───────────────────────────────────────────────
function mostrarTab(tab) {
  document.getElementById('tab-login').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('tab-registro').style.display = tab === 'registro' ? 'block' : 'none';
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'registro' && i === 1));
  });
}

async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  document.getElementById('login-error').textContent = '';

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
    token = data.token;
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    mostrarApp();
  } catch (err) {
    document.getElementById('login-error').textContent = err.message;
  }
}

async function registro() {
  const nombre = document.getElementById('reg-nombre').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  document.getElementById('reg-error').textContent = '';

  try {
    const res = await fetch(`${API}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al registrarse');
    token = data.token;
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    mostrarApp();
  } catch (err) {
    document.getElementById('reg-error').textContent = err.message;
  }
}

function cerrarSesion() {
  token = null;
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  mostrarAuth();
}

function mostrarAuth() {
  document.getElementById('auth-section').style.display = 'flex';
  document.getElementById('app-section').style.display = 'none';
}

function mostrarApp() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('app-section').style.display = 'block';
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  document.getElementById('usuario-nombre').textContent = `👤 ${usuario.nombre || ''}`;
  cargarTareas();
}

// ─── TAREAS ─────────────────────────────────────────────
async function cargarTareas() {
  const estado = document.getElementById('filtro-estado').value;
  const fecha = document.getElementById('filtro-fecha').value;
  let url = `${API}/tareas`;
  const params = [];
  if (estado) params.push(`estado=${estado}`);
  if (fecha) params.push(`fecha=${fecha}`);
  if (params.length) url += '?' + params.join('&');

  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401) { cerrarSesion(); return; }
    const data = await res.json();
    renderTareas(data.tareas || []);
  } catch (err) {
    document.getElementById('lista-tareas').innerHTML = '<p class="vacio">Error al cargar tareas.</p>';
  }
}

function renderTareas(tareas) {
  const lista = document.getElementById('lista-tareas');
  if (tareas.length === 0) {
    lista.innerHTML = '<p class="vacio">No hay tareas. ¡Crea una!</p>';
    return;
  }
  lista.innerHTML = tareas.map(t => `
    <div class="tarea-item">
      <div class="tarea-info">
        <h4>${t.titulo}</h4>
        ${t.descripcion ? `<p>${t.descripcion}</p>` : ''}
        <p>📅 ${t.fecha}</p>
        <span class="badge ${t.estado}">${t.estado}</span>
      </div>
      <div class="tarea-acciones">
        <button class="btn-editar" onclick="editarTarea('${t._id}','${t.titulo}','${t.descripcion || ''}','${t.fecha}','${t.estado}')">✏️ Editar</button>
        <button class="btn-eliminar" onclick="eliminarTarea('${t._id}')">🗑️ Eliminar</button>
      </div>
    </div>
  `).join('');
}

async function guardarTarea() {
  const id = document.getElementById('tarea-id').value;
  const titulo = document.getElementById('tarea-titulo').value;
  const descripcion = document.getElementById('tarea-descripcion').value;
  const fecha = document.getElementById('tarea-fecha').value;
  const estado = document.getElementById('tarea-estado').value;
  document.getElementById('tarea-error').textContent = '';

  const body = { titulo, descripcion, fecha, estado };
  const url = id ? `${API}/tareas/${id}` : `${API}/tareas`;
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error((data.errores || [data.error]).join(', '));
    cancelarEdicion();
    cargarTareas();
  } catch (err) {
    document.getElementById('tarea-error').textContent = err.message;
  }
}

function editarTarea(id, titulo, descripcion, fecha, estado) {
  document.getElementById('tarea-id').value = id;
  document.getElementById('tarea-titulo').value = titulo;
  document.getElementById('tarea-descripcion').value = descripcion;
  document.getElementById('tarea-fecha').value = fecha;
  document.getElementById('tarea-estado').value = estado;
  document.getElementById('form-titulo-label').textContent = 'Editar Tarea';
  document.getElementById('btn-cancelar').style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelarEdicion() {
  document.getElementById('tarea-id').value = '';
  document.getElementById('tarea-titulo').value = '';
  document.getElementById('tarea-descripcion').value = '';
  document.getElementById('tarea-fecha').value = '';
  document.getElementById('tarea-estado').value = 'pendiente';
  document.getElementById('form-titulo-label').textContent = 'Nueva Tarea';
  document.getElementById('btn-cancelar').style.display = 'none';
  document.getElementById('tarea-error').textContent = '';
}

async function eliminarTarea(id) {
  if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;
  try {
    const res = await fetch(`${API}/tareas/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al eliminar');
    cargarTareas();
  } catch (err) {
    alert(err.message);
  }
}

function limpiarFiltros() {
  document.getElementById('filtro-estado').value = '';
  document.getElementById('filtro-fecha').value = '';
  cargarTareas();
}
