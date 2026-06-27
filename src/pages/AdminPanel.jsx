import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styles from './AdminPanel.module.css';

export default function AdminPanel() {
  const [usuarios, setUsuarios]         = useState([]);
  const [error, setError]               = useState('');
  const [modalEditar, setModalEditar]   = useState(null);
  const [formEdit, setFormEdit]         = useState({ nombre: '', apellido: '', email: '', rol: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout }                = useAuth();
  const navigate                        = useNavigate();
  const dropdownRef                     = useRef(null);

  useEffect(() => { fetchUsuarios(); }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await api.get('/api/auth/admin/users');
      setUsuarios(res.data);
    } catch {
      setError('Error al cargar usuarios');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este usuario? Se eliminarán todas sus materias y apuntes.')) return;
    try {
      await api.delete(`/api/auth/admin/users/${id}`);
      fetchUsuarios();
    } catch {
      setError('Error al eliminar usuario');
    }
  };

  const abrirEditar = (u) => {
    setModalEditar(u);
    setFormEdit({ nombre: u.nombre, apellido: u.apellido, email: u.email, rol: u.rol });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/auth/admin/users/${modalEditar.id}`, formEdit);
      setModalEditar(null);
      fetchUsuarios();
    } catch {
      setError('Error al actualizar usuario');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const rolBadge = (rol) => rol === 'ROLE_ADMIN' ? styles.badgeAdmin : styles.badgeUser;
  const rolLabel = (rol) => rol === 'ROLE_ADMIN' ? 'Admin' : 'Usuario';

  return (
    <div className={styles.wrapper}>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <span className={styles.logo} onClick={() => navigate('/admin')}>
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
          <h1 className={styles.pageTitle}>Panel de administración</h1>
          <p className={styles.pageSubtitle}>Gestiona los usuarios de la plataforma</p>
        </div>
      </div>

      {/* Content */}
      <main className={styles.content}>
        {error && <div className="alert alert-error">{error}</div>}

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <p className={styles.tableTitle}>Usuarios registrados</p>
            <span className={styles.tableCount}>{usuarios.length} usuarios</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>ID</th>
                  <th className={styles.th}>Nombre</th>
                  <th className={styles.th}>Apellido</th>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Rol</th>
                  <th className={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.idBadge}>#{u.id}</span>
                    </td>
                    <td className={styles.td}>{u.nombre}</td>
                    <td className={styles.td}>{u.apellido}</td>
                    <td className={styles.td}>
                      <span className={styles.email}>{u.email}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${rolBadge(u.rol)}`}>
                        {rolLabel(u.rol)}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actions}>
                        <button className={styles.editBtn} onClick={() => abrirEditar(u)}>
                          Editar
                        </button>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(u.id)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal editar */}
      {modalEditar && (
        <div className={styles.modalOverlay} onClick={() => setModalEditar(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Editar usuario</h2>
            <form onSubmit={handleEditSubmit} className={styles.modalForm}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  className="input"
                  value={formEdit.nombre}
                  onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Apellido</label>
                <input
                  className="input"
                  value={formEdit.apellido}
                  onChange={(e) => setFormEdit({ ...formEdit, apellido: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="input"
                  type="email"
                  value={formEdit.email}
                  onChange={(e) => setFormEdit({ ...formEdit, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Rol</label>
                <select
                  className="input"
                  value={formEdit.rol}
                  onChange={(e) => setFormEdit({ ...formEdit, rol: e.target.value })}
                >
                  <option value="ROLE_USER">Usuario</option>
                  <option value="ROLE_ADMIN">Administrador</option>
                </select>
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