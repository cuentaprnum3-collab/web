import { apiService } from './api';

export const authService = {
  login: (email, password) =>
    apiService.post('/auth/login', { email, password }, false),

  registro: (nombre, email, password, aceptaTerminos) =>
    apiService.post('/auth/registro', { nombre, email, password, aceptaTerminos: aceptaTerminos }, false),

  verificarCorreo: (email, codigo) =>
    apiService.post('/auth/verificar-correo', { email, codigo }, false),

  reenviarCodigo: (email) =>
    apiService.post('/auth/reenviar-codigo', { email }, false),

  perfil: () =>
    apiService.get('/auth/perfil'),

  actualizarPerfil: (data) =>
    apiService.put('/auth/perfil', data),

  logout: () =>
    apiService.post('/auth/logout', {}),

  recuperar: (email) =>
    apiService.post('/auth/recuperar', { email }, false),

  resetPassword: (email, codigo, nuevaPassword) =>
    apiService.post('/auth/reset-password', { email, codigo, nuevaPassword }, false),

  obtenerPapelera: () =>
    apiService.get('/auth/papelera'),

  limpiarPapelera: () =>
    apiService.post('/auth/papelera/limpiar', {}),

  eliminarCuenta: () =>
    apiService.delete('/auth/perfil'),
};

export const materiasService = {
  listar: () =>
    apiService.get('/materias'),

  listarArchivadas: () =>
    apiService.get('/materias/archivadas'),

  listarEliminadas: () =>
    apiService.get('/materias/eliminadas/lista'),

  detalle: (id) =>
    apiService.get(`/materias/${id}`),

  crear: (data) =>
    apiService.post('/materias', data),

  actualizar: (id, data) =>
    apiService.put(`/materias/${id}`, data),

  compartir: (id, emails) =>
    apiService.post(`/materias/${id}/compartir`, { emails }),

  buscarGrupo: (grupoId) =>
    apiService.get(`/materias/grupo/${grupoId}`),

  unirseGrupo: (grupoId) =>
    apiService.post('/materias/grupo/unirse', { grupoId }),

  listarInvitaciones: () =>
    apiService.get('/materias/invitaciones'),

  aceptarInvitacion: (miembroId) =>
    apiService.post(`/materias/invitaciones/${miembroId}/aceptar`, {}),

  rechazarInvitacion: (miembroId) =>
    apiService.post(`/materias/invitaciones/${miembroId}/rechazar`, {}),

  salirGrupo: (id) =>
    apiService.post(`/materias/${id}/salir`, {}),

  archivar: (id) =>
    apiService.patch(`/materias/${id}/archivar`, {}),

  eliminar: (id) =>
    apiService.delete(`/materias/${id}`),

  restaurar: (id) =>
    apiService.post(`/materias/${id}/restaurar`, {}),
};

export const notasService = {
  listar: (materiaid = null) => {
    const endpoint = materiaid ? `/notas?materiaId=${materiaid}` : '/notas';
    return apiService.get(endpoint);
  },

  detalle: (id) =>
    apiService.get(`/notas/${id}`),

  crear: (data) =>
    apiService.post('/notas', data),

  crearConArchivo: (formData) =>
    apiService.postFormData('/notas', formData),

  actualizar: (id, data) =>
    apiService.put(`/notas/${id}`, data),

  eliminar: (id) =>
    apiService.delete(`/notas/${id}`),

  restaurar: (id) =>
    apiService.post(`/notas/${id}/restaurar`, {}),
};

export const librosService = {
  listar: () =>
    apiService.get('/libros'),

  detalle: (id) =>
    apiService.get(`/libros/${id}`),

  crear: (data) =>
    apiService.post('/libros', data),

  actualizar: (id, data) =>
    apiService.put(`/libros/${id}`, data),

  cambiarEstado: (id, estado) =>
    apiService.patch(`/libros/${id}/estado`, { estado }),

  eliminar: (id) =>
    apiService.delete(`/libros/${id}`),

  restaurar: (id) =>
    apiService.post(`/libros/${id}/restaurar`, {}),
};

export const sesionesService = {
  listar: () =>
    apiService.get('/sesiones'),

  crearSesion: (data) =>
    apiService.post('/sesiones', data),

  registrar: (data) =>
    apiService.post('/sesiones/registrar', data),
};

export const metasService = {
  obtenerMeta: () =>
    apiService.get('/metas/activa'),

  actualizarMeta: (paginasSemana) =>
    apiService.post('/metas', { paginasSemana }),

  historial: () =>
    apiService.get('/metas/historial'),
};

export const statsService = {
  obtenerStats: () =>
    apiService.get('/stats'),

  actividadSemanal: () =>
    apiService.get('/stats/actividad-semanal'),

  racha: () =>
    apiService.get('/stats/racha'),
};

export const logrosService = {
  listar: () =>
    apiService.get('/logros'),

  detalle: (id) =>
    apiService.get(`/logros/${id}`),
};

export const archivosService = {
  subirArchivo: (formData) =>
    apiService.postFormData('/archivos', formData),

  eliminar: (id) =>
    apiService.delete(`/archivos/${id}`),
};
