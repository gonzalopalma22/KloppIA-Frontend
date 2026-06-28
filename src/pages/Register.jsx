import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import styles from './Register.module.css';

export default function Register() {
  const [form, setForm]       = useState({ nombre: '', apellido: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/registro', form);
      navigate('/login');
    } catch {
      setError('Error al registrarse. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* CORRECCIÓN: Se cambió <link> por <Link> */}
        <Link to="/" className={styles.logo}>
          Klopp<span className={styles.logoAccent}>IA</span>
        </Link>
        <div className={styles.formHeader}>
          <h1 className={styles.formTitle}>Crear cuenta</h1>
          <p className={styles.formSubtitle}>Completa tus datos para registrarte</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Nombre</label>
              <input
                className="input"
                name="nombre"
                placeholder="Juan"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Apellido</label>
              <input
                className="input"
                name="apellido"
                placeholder="Pérez"
                value={form.apellido}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              className="input"
              name="email"
              type="email"
              placeholder="tu@correo.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              className="input"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className={styles.footer}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.footerLink}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div> 
  );
}