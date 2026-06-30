import { useState, useEffect, useRef } from 'react';

function TimerIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2" />
      <path d="M7 6h10" />
    </svg>
  );
}

function SettingsIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m6.08 0l4.24-4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m6.08 0l4.24 4.24" />
    </svg>
  );
}

function StopIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
  );
}

function MusicNoteIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

export function ReadingSessionBar({ session, onUpdateSession, onEndSession, C }) {
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [appliedTime, setAppliedTime] = useState({
    tiempoMinutos: session?.tiempoMinutos || 25,
    tipo: session?.tipo || 'normal',
  });
  const [editTimeForm, setEditTimeForm] = useState(appliedTime);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const audioRef = useRef(null);
  const timerEndedRef = useRef(false);

  // Actualizar el cronómetro cada segundo (usa el tiempo aplicado, no el formulario en edición)
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoTranscurrido(t => {
        const tiempoTotal = appliedTime.tiempoMinutos * 60;
        if (t + 1 > tiempoTotal) {
          return tiempoTotal;
        }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [appliedTime.tiempoMinutos]);

  const tiempoRestante = Math.max(0, appliedTime.tiempoMinutos * 60 - tiempoTranscurrido);
  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;
  const progreso = (tiempoTranscurrido / (appliedTime.tiempoMinutos * 60)) * 100;

  useEffect(() => {
    if (tiempoRestante === 0 && !timerEndedRef.current) {
      timerEndedRef.current = true;
      onEndSession();
      return;
    }
    if (tiempoRestante > 0 && timerEndedRef.current) {
      timerEndedRef.current = false;
    }
  }, [tiempoRestante, onEndSession]);

  useEffect(() => {
    if (!session?.musicaActiva || !session?.musicaSrc) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    const audio = new Audio(session.musicaSrc);
    audio.loop = true;
    audio.volume = 0.45;
    audio.play().catch(() => {});
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [session?.musicaActiva, session?.musicaSrc]);

  // Sincronizar appliedTime cuando la sesión cambia desde el padre
  useEffect(() => {
    const next = { tiempoMinutos: session?.tiempoMinutos || 25, tipo: session?.tipo || 'normal' };
    setAppliedTime(next);
    setEditTimeForm(next);
  }, [session?.tiempoMinutos, session?.tipo]);

  const musicLabel = session?.musicaActiva ? session.musicaNombre || 'Música activa' : 'Sin música';
  const musicBadge = session?.musicaActiva ? 'Activa' : 'Inactiva';

  const handleEndSession = () => {
    onEndSession({ paginasLidas: 0, paginaFinal: session.paginaInicial, tipo: appliedTime.tipo });
  };

  const handleToggleMusic = () => {
    if (!session) return;
    if (session.musicaActiva) {
      onUpdateSession({ musicaActiva: false });
      return;
    }
    if (session.musicaSrc) {
      onUpdateSession({ musicaActiva: true });
    }
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '240px',
        right: 0,
        height: '95px',
        background: C.dark,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        boxShadow: '0 -4px 12px rgba(0,0,0,.15)',
        zIndex: 90,
      }}>
        {/* Info del libro */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            background: C.lime,
            color: C.dark,
            padding: '8px 14px',
            borderRadius: '999px',
            fontWeight: 600,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <TimerIcon size={16} />
            Leyendo
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '22px', fontWeight: 600, maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {session.libro.titulo}
            </div>
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '14px' }}>
              {session.libro.autor || 'Autor desconocido'}
            </div>
          </div>
        </div>

        {/* Tiempo y controles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {/* Cronómetro */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: C.lime, fontFamily: 'monospace' }}>
              {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.45)', marginTop: '4px' }}>
              {appliedTime.tipo === 'pomodoro' ? 'Pomodoro' : 'Personalizada'}
            </div>
          </div>

          {/* Botones de control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => { setEditTimeForm(appliedTime); setShowTimeModal(true); }}
              style={{
                width: '48px',
                height: '48px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                background: C.lime,
                color: C.dark,
                transition: 'all .2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              title="Cambiar tiempo"
            >
              <SettingsIcon size={20} />
            </button>

            <button
              onClick={handleToggleMusic}
              style={{
                width: '48px',
                height: '48px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                background: session?.musicaActiva ? '#f59e0b' : 'rgba(255,255,255,.12)',
                color: session?.musicaActiva ? C.dark : 'rgba(255,255,255,.65)',
                transition: 'all .2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              title={session?.musicaActiva ? 'Detener música' : session?.musicaSrc ? 'Activar música' : 'Sin música disponible'}
            >
              <MusicNoteIcon size={20} />
            </button>

            <button
              onClick={handleEndSession}
              style={{
                width: '48px',
                height: '48px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                background: '#ef4444',
                color: 'white',
                transition: 'all .2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              title="Finalizar sesión"
            >
              <StopIcon size={20} />
            </button>
          </div>


          {/* Información de páginas */}
          <div>
            <div>
              Página: <strong style={{ color: C.lime }}>#{session.paginaInicial}</strong>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.5)' }}>
              Duración: {appliedTime.tiempoMinutos} min
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '240px',
        right: 0,
        height: '6px',
        background: 'rgba(255,255,255,.08)',
        zIndex: 89,
      }}>
        <div style={{
          width: `${progreso}%`,
          height: '100%',
          background: C.lime,
          transition: '.3s',
        }}></div>
      </div>

      {/* Modal para cambiar tiempo */}
      {showTimeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,.45)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }} onClick={() => setShowTimeModal(false)}>
          <div style={{
            background: C.white,
            borderRadius: '20px',
            padding: '28px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0,0,0,.2)',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 800,
                color: C.tPrimary,
              }}>
                Configurar tiempo de lectura
              </div>
              <button
                onClick={() => setShowTimeModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: C.tHint,
                  fontSize: 20,
                }}
              >
                ×
              </button>
            </div>

            {/* Tipo de sesión */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: C.tSecondary,
                marginBottom: '6px',
              }}>
                Tipo de sesión
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setEditTimeForm({ ...editTimeForm, tipo: 'normal' })}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: editTimeForm.tipo === 'normal' ? `2px solid ${C.lime}` : `1.5px solid ${C.g300}`,
                    borderRadius: '11px',
                    background: editTimeForm.tipo === 'normal' ? `rgba(190,213,47,.1)` : C.white,
                    color: C.tPrimary,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13px',
                    transition: 'all .15s',
                  }}
                >
                  Sesión personalizada
                </button>
                <button
                  onClick={() => setEditTimeForm({ ...editTimeForm, tipo: 'pomodoro', tiempoMinutos: 25 })}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: editTimeForm.tipo === 'pomodoro' ? `2px solid ${C.lime}` : `1.5px solid ${C.g300}`,
                    borderRadius: '11px',
                    background: editTimeForm.tipo === 'pomodoro' ? `rgba(190,213,47,.1)` : C.white,
                    color: C.tPrimary,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13px',
                    transition: 'all .15s',
                  }}
                >
                  Pomodoro (25 min)
                </button>
              </div>
            </div>

            {/* Tiempo personalizado */}
            {editTimeForm.tipo === 'normal' && (
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: C.tSecondary,
                  marginBottom: '6px',
                }}>
                  Duración (minutos)
                </div>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={editTimeForm.tiempoMinutos}
                  onChange={(e) => setEditTimeForm({ ...editTimeForm, tiempoMinutos: Math.max(1, parseInt(e.target.value) || 1) })}
                  style={{
                    width: '100%',
                    height: '46px',
                    background: C.g100,
                    border: `1.5px solid ${C.g300}`,
                    borderRadius: '11px',
                    padding: '0 14px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    color: C.tPrimary,
                    outline: 'none',
                    transition: 'border-color .15s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = C.purple;
                    e.target.style.background = C.white;
                    e.target.style.boxShadow = '0 0 0 3px rgba(124,42,142,.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = C.g300;
                    e.target.style.background = C.g100;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            )}

            {/* Botones */}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button
                onClick={() => setShowTimeModal(false)}
                style={{
                  flex: 1,
                  height: '40px',
                  border: `1.5px solid ${C.g300}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: C.white,
                  color: C.tSecondary,
                  fontWeight: 700,
                  fontSize: '13px',
                  transition: 'all .12s',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aplicar los cambios solo al guardar
                  setAppliedTime(editTimeForm);
                  onUpdateSession(editTimeForm);
                  setShowTimeModal(false);
                }}
                style={{
                  flex: 1,
                  height: '40px',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: C.lime,
                  color: C.dark,
                  fontWeight: 700,
                  fontSize: '13px',
                  transition: 'all .12s',
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
