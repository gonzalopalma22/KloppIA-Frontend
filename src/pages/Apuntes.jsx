import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styles from './Apuntes.module.css';

export default function Apuntes() {
  const { id }                            = useParams();
  const [apuntes, setApuntes]             = useState([]);
  const [materia, setMateria]             = useState(null);
  const [titulo, setTitulo]               = useState('');
  const [archivo, setArchivo]             = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [apunteAbierto, setApunteAbierto] = useState(null);
  const [dropdownOpen, setDropdownOpen]   = useState(false);
  const [menuAbierto, setMenuAbierto]     = useState(null);
  const [modalEditar, setModalEditar]     = useState(null);
  const [formEditar, setFormEditar]       = useState({ titulo: '' });
  const { user, logout }                  = useAuth();
  const navigate                          = useNavigate();
  const dropdownRef                       = useRef(null);

  useEffect(() => {
    fetchApuntes();
    fetchMateria();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (!e.target.closest(`.${styles.cardMenu}`)) {
        setMenuAbierto(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchMateria = async () => {
    try {
      const res = await api.get(`/api/materias/${id}`);
      setMateria(res.data);
    } catch {}
  };

  const fetchApuntes = async () => {
    try {
      const res = await api.get(`/api/materias/${id}/apuntes`);
      setApuntes(res.data);
    } catch {
      setError('Error al cargar apuntes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivo) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('archivo', archivo);
      await api.post(`/api/materias/${id}/apuntes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setTitulo('');
      setArchivo(null);
      fetchApuntes();
    } catch {
      setError('Error al subir apunte');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (apunteId) => {
    if (!confirm('¿Eliminar este apunte?')) return;
    try {
      await api.delete(`/api/materias/${id}/apuntes/${apunteId}`);
      if (apunteAbierto?.id === apunteId) setApunteAbierto(null);
      fetchApuntes();
    } catch {
      setError('Error al eliminar apunte');
    }
  };

  const abrirEditar = (a) => {
    setMenuAbierto(null);
    setModalEditar(a);
    setFormEditar({ titulo: a.titulo });
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/materias/${id}/apuntes/${modalEditar.id}`, formEditar);
      setModalEditar(null);
      fetchApuntes();
    } catch {
      setError('Error al editar apunte');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={styles.wrapper}>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <span className={styles.logo} onClick={() => navigate('/materias')}>
            Klopp<span className={styles.logoAccent}>IA</span>
          </span>
          <div className={styles.navRight}>
            <div className={styles.userMenu} ref={dropdownRef}>
              <button
                className={styles.userBtn}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user?.nombre}
                <span className={styles.userBtnChevron}>▼</span>
              </button>
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <button className={styles.dropdownItem} onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerGrid} />
        <div className={styles.headerGlow} />
        <div className={styles.headerInner}>
          <button className={styles.backBtn} onClick={() => navigate('/materias')}>
            ← Volver a materias
          </button>
          <h1 className={styles.pageTitle}>{materia?.nombre ?? 'Apuntes'}</h1>
          <p className={styles.pageSubtitle}>
            {materia?.descripcion ?? 'Sube tus PDFs y obtén resúmenes generados por IA'}
          </p>
        </div>
      </div>

      {/* Content */}
      <main className={styles.content}>
        {error && <div className="alert alert-error">{error}</div>}

        <div className={styles.formCard}>
          <p className={styles.formTitle}>Subir nuevo apunte</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formInput}>
              <input
                className="input"
                placeholder="Título del apunte"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div className={styles.fileWrapper}>
              <label className={styles.fileLabel}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setArchivo(e.target.files[0])}
                  required
                  className={styles.fileInput}
                />
                <span className={styles.filePlaceholder}>
                  {archivo ? archivo.name : 'Seleccionar PDF'}
                </span>
              </label>
            </div>
            <button type="submit" className={styles.addBtn} disabled={loading}>
              {loading ? 'Procesando...' : 'Subir'}
            </button>
          </form>
          {loading && (
            <p className={styles.loadingMsg}>
              Generando resumen con IA, esto puede tomar unos segundos...
            </p>
          )}
        </div>

        <p className={styles.sectionTitle}>
          {apuntes.length} {apuntes.length === 1 ? 'apunte' : 'apuntes'}
        </p>

        {apuntes.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No hay apuntes aún</p>
            <p className={styles.emptyDesc}>Sube tu primer PDF para generar un resumen automático</p>
          </div>
        ) : (
          <div className={styles.list}>
            {apuntes.map((a) => (
              <div key={a.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <p className={styles.cardTitle}>{a.titulo}</p>
                    <p className={styles.cardFile}>{a.nombreArchivo}</p>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.resumeBtn}
                      onClick={() => setApunteAbierto(apunteAbierto?.id === a.id ? null : a)}
                    >
                      {apunteAbierto?.id === a.id ? 'Ocultar resumen' : 'Ver resumen'}
                    </button>
                    <div className={styles.cardMenu}>
                      <button
                        className={styles.menuBtn}
                        onClick={() => setMenuAbierto(menuAbierto === a.id ? null : a.id)}
                      >
                        ⋮
                      </button>
                      {menuAbierto === a.id && (
                        <div className={styles.cardDropdown}>
                          <button
                            className={styles.cardDropdownItem}
                            onClick={(e) => { e.stopPropagation(); abrirEditar(a); }}
                          >
                            Editar título
                          </button>
                          <button
                            className={`${styles.cardDropdownItem} ${styles.cardDropdownDanger}`}
                            onClick={(e) => { e.stopPropagation(); setMenuAbierto(null); handleDelete(a.id); }}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {apunteAbierto?.id === a.id && (
                  <div className={styles.resumen}>
                    <p className={styles.resumenLabel}>Resumen generado por IA</p>
                    <p className={styles.resumenText}>{a.resumen}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal editar */}
      {modalEditar && (
        <div className={styles.modalOverlay} onClick={() => setModalEditar(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Editar apunte</h2>
            <form onSubmit={handleEditar} className={styles.modalForm}>
              <div className="form-group">
                <label className="form-label">Título</label>
                <input
                  className="input"
                  value={formEditar.titulo}
                  onChange={(e) => setFormEditar({ titulo: e.target.value })}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.modalCancelBtn} onClick={() => setModalEditar(null)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.modalSaveBtn}>
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}