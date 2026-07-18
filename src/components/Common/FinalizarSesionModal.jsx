import { useState, useEffect } from 'react';

export function FinalizarSesionModal({ libro, sesion, onConfirm, onCancel, C }) {
  if (!libro || !sesion) return null;

  const getDefaultPaginaFinal = () => {
    return sesion.paginaInicial < libro.totalPaginas
      ? sesion.paginaInicial + 1
      : sesion.paginaInicial;
  };

  const [paginaFinal, setPaginaFinal] = useState(getDefaultPaginaFinal());
  const [error, setError] = useState('');
  const paginaFinalNum = paginaFinal === '' ? 0 : Number(paginaFinal);
  const paginasLidas = paginaFinalNum - sesion.paginaInicial;

  useEffect(() => {
    setPaginaFinal(getDefaultPaginaFinal());
    setError('');
  }, [sesion.paginaInicial, libro.totalPaginas]);

  const handleConfirm = () => {
    if (paginaFinal === '' || paginaFinalNum <= sesion.paginaInicial) {
      setError('La página final debe ser mayor a la página inicial para guardar la sesión.');
      return;
    }

    onConfirm(paginaFinalNum, paginasLidas);
  };

  const handleInputChange = (event) => {
    const raw = event.target.value;
    if (raw === '') {
      // Permitir dejar el campo vacío mientras se escribe un nuevo número;
      // se valida al guardar, no en cada tecla.
      setPaginaFinal('');
      setError('');
      return;
    }
    const value = parseInt(raw, 10);
    if (Number.isNaN(value)) return;
    // Solo se limita el máximo (no se puede pasar del total de páginas).
    // Antes también se forzaba un mínimo de sesion.paginaInicial en cada
    // tecla, lo que hacía imposible escribir un número menor (por ejemplo,
    // al intentar escribir "60" partiendo de la página 55, el primer "6"
    // se corregía a 55, y luego seguir escribiendo terminaba en el máximo).
    setPaginaFinal(Math.max(0, Math.min(libro.totalPaginas, value)));
    setError('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.45)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: C.white,
          borderRadius: '20px',
          padding: '28px',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 20px 60px rgba(0,0,0,.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: C.tPrimary,
            }}
          >
            ¿En qué página finalizaste?
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

        <div
          style={{
            background: C.g100,
            padding: '14px',
            borderRadius: '11px',
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: C.tPrimary, marginBottom: 4 }}>
            📖 {libro.titulo}
          </div>
          <div style={{ fontSize: 12, color: C.tHint }}>
            Iniciaste en página {sesion.paginaInicial} · {libro.totalPaginas} páginas total
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: C.tSecondary,
              marginBottom: '6px',
            }}
          >
            Página final
          </div>
            <input
            type="number"
            min={sesion.paginaInicial}
            max={libro.totalPaginas}
            value={paginaFinal}
            onChange={handleInputChange}
            onFocus={(event) => {
              event.target.style.borderColor = C.purple;
              event.target.style.background = C.white;
              event.target.style.boxShadow = '0 0 0 3px rgba(124,42,142,.08)';
            }}
            onBlur={(event) => {
              event.target.style.borderColor = C.g300;
              event.target.style.background = C.g100;
              event.target.style.boxShadow = 'none';
            }}
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
          />
          {error ? (
            <div style={{ color: '#b91c1c', fontSize: '13px', marginTop: '10px' }}>{error}</div>
          ) : null}
        </div>

        <div
          style={{
            background: 'rgba(190,213,47,.1)',
            border: `1px solid ${C.lime}`,
            padding: '14px',
            borderRadius: '9px',
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: C.tPrimary, marginBottom: 6 }}>
            📊 Resumen de esta sesión
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: C.tSecondary }}>Páginas leídas:</span>
            <span style={{ fontWeight: 700, color: C.tPrimary }}>{paginasLidas} páginas</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
            <span style={{ color: C.tSecondary }}>Tipo de sesión:</span>
            <span style={{ fontWeight: 700, color: C.tPrimary }}>
              {sesion.tipo === 'pomodoro' ? '🍅 Pomodoro' : 'Sesión personalizada'}
            </span>
          </div>
        </div>

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
            Seguir leyendo
          </button>
          <button
            onClick={handleConfirm}
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
            Guardar sesión
          </button>
        </div>
      </div>
    </div>
  );
}