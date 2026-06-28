import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styles from './Login.module.css';

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', form);
      login({ nombre: res.data.nombre, email: res.data.email, rol: res.data.rol }, res.data.token);
      navigate(res.data.rol === 'ROLE_ADMIN' ? '/admin' : '/materias');
    } catch {
      setError('Email o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Link to="/" className={styles.logo}>
          Klopp<span className={styles.logoAccent}>IA</span>
        </Link>

        <div className={styles.formHeader}>
          <h1 className={styles.formTitle}>Bienvenido de vuelta</h1>
          <p className={styles.formSubtitle}>Ingresa tus credenciales para continuar</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
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

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className={styles.footer}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className={styles.footerLink}>
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}