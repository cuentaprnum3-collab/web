import { useState } from 'react';
import { MUSIC_TRACKS } from './musicTracks';

export function IniciarSesionModal({ libro, onStart, onCancel, C }) {
  const [paginaInicial, setPaginaInicial] = useState(
    libro.estado === 'TERMINADO' ? 0 : (libro.paginasLeidas || 0)
  );
  const [tiempoMinutos, setTiempoMinutos] = useState(25);
  const [tipo, setTipo] = useState('normal');
  const [musicaActiva, setMusicaActiva] = useState(false);
  const [musicaSeleccionada, setMusicaSeleccionada] = useState(MUSIC_TRACKS[0]?.id || '');
  const musicaSeleccionadaDatos = MUSIC_TRACKS.find(t => t.id === musicaSeleccionada) || MUSIC_TRACKS[0] || {};

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,.45)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }} onClick={onCancel}>
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
            Iniciar sesión de lectura
          </div>
          <button
            onClick={onCancel}
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

        {/* Información del libro */}
        <div style={{
          background: C.g100,
          padding: '14px',
          borderRadius: '11px',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.tPrimary, marginBottom: 4 }}>
            📖 {libro.titulo}
          </div>
          <div style={{ fontSize: 12, color: C.tHint }}>
            {libro.autor || 'Autor desconocido'} • {libro.totalPaginas} páginas
          </div>
        </div>

        {/* Página inicial */}
        <div style={{ marginBottom: 14 }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            color: C.tSecondary,
            marginBottom: '6px',
          }}>
            Página inicial
          </div>
          <input
            type="number"
            min="0"
            max={libro.totalPaginas}
            value={paginaInicial}
            onChange={(e) => setPaginaInicial(Math.max(0, Math.min(libro.totalPaginas, parseInt(e.target.value) || 0)))}
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
              e.target.style.boxShadow = `0 0 0 3px rgba(124,42,142,.08)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = C.g300;
              e.target.style.background = C.g100;
              e.target.style.boxShadow = 'none';
            }}
          />
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
              onClick={() => {
                setTipo('normal');
                setTiempoMinutos(25);
              }}
              style={{
                flex: 1,
                padding: '12px',
                border: tipo === 'normal' ? `2px solid ${C.lime}` : `1.5px solid ${C.g300}`,
                borderRadius: '11px',
                background: tipo === 'normal' ? 'rgba(190,213,47,.1)' : C.white,
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
              onClick={() => {
                setTipo('pomodoro');
                setTiempoMinutos(25);
              }}
              style={{
                flex: 1,
                padding: '12px',
                border: tipo === 'pomodoro' ? `2px solid ${C.lime}` : `1.5px solid ${C.g300}`,
                borderRadius: '11px',
                background: tipo === 'pomodoro' ? 'rgba(190,213,47,.1)' : C.white,
                color: C.tPrimary,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                transition: 'all .15s',
              }}
            >
              🍅 Pomodoro (25 min)
            </button>
          </div>
        </div>

        {/* Tiempo personalizado */}
        {tipo === 'normal' && (
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
              value={tiempoMinutos}
              onChange={(e) => setTiempoMinutos(Math.max(1, parseInt(e.target.value) || 1))}
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
                e.target.style.boxShadow = `0 0 0 3px rgba(124,42,142,.08)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = C.g300;
                e.target.style.background = C.g100;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        )}

        {/* Música de fondo */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            color: C.tSecondary,
            marginBottom: '6px',
          }}>
            Música de fondo
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              border: `1.5px solid ${C.g300}`,
              borderRadius: '11px',
              background: C.white,
              color: C.tPrimary,
              fontWeight: 700,
              fontSize: '13px',
            }}>
              <span style={{ fontSize: '16px' }}>🎵</span>
              <span>{musicaSeleccionadaDatos.name}</span>
            </div>
            <select
              value={musicaSeleccionada}
              onChange={(e) => setMusicaSeleccionada(e.target.value)}
              style={{
                minWidth: '160px',
                height: '46px',
                background: C.g100,
                border: `1.5px solid ${C.g300}`,
                borderRadius: '11px',
                padding: '0 14px',
                color: C.tPrimary,
                fontSize: '14px',
                outline: 'none',
              }}
            >
              {MUSIC_TRACKS.map(track => (
                <option key={track.id} value={track.id}>{track.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setMusicaActiva(!musicaActiva)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 18px',
                border: 'none',
                borderRadius: '999px',
                background: musicaActiva ? C.lime : C.g300,
                color: musicaActiva ? C.dark : C.tPrimary,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '13px',
                transition: 'all .15s',
              }}
            >
              {musicaActiva ? 'Desactivar' : 'Activar'}
            </button>
          </div>
          <div style={{ fontSize: '12px', color: C.tHint, marginTop: '8px' }}>
            La música solo se reproducirá si está activada.
          </div>
        </div>

        {/* Info */}
        <div style={{
          background: 'rgba(190,213,47,.1)',
          border: `1px solid ${C.lime}`,
          padding: '12px',
          borderRadius: '9px',
          marginBottom: 20,
          fontSize: '12px',
          color: '#5a5d2e',
        }}>
          ℹ️ Al finalizar, se te preguntará en qué página terminaste la sesión
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
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
            onClick={() => onStart({
              paginaInicial,
              tiempoMinutos,
              tipo,
              musicaActiva,
              musicaNombre: musicaActiva ? musicaSeleccionadaDatos.name : '',
              musicaSrc: musicaActiva ? musicaSeleccionadaDatos.src : '',
            })}
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
            Comenzar lectura
          </button>
        </div>
      </div>
    </div>
  );
}
