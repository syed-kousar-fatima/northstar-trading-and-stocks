import { useRef, useState } from 'react';
import { FiX } from 'react-icons/fi';
import Brand from './Brand';

export const DEMO_EMAIL = 'demo@northstar.app';
export const DEMO_PASSWORD = 'trade123';

export default function AuthModal({ mode: initialMode, onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState('');
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (mode === 'login' && (email !== DEMO_EMAIL || password !== DEMO_PASSWORD)) {
      setError('Those details do not match the demo account. Try the credentials below.');
      return;
    }
    if (mode === 'signup') {
      const confirmPassword = String(formData.get('confirmPassword') ?? '');
      if (password.length < 8) {
        setError('Use at least 8 characters for your password.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Your passwords do not match.');
        return;
      }
    }
    setError('');
    onSuccess(mode);
  }

  function fillDemo() {
    if (emailRef.current) emailRef.current.value = DEMO_EMAIL;
    if (passwordRef.current) passwordRef.current.value = DEMO_PASSWORD;
    setError('');
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-card auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="modal-close" type="button" aria-label="Close" onClick={onClose}><FiX /></button>
        <Brand />
        <div className="modal-eyebrow">YOUR NEXT CHAPTER STARTS HERE</div>
        <h2 id="auth-title">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="modal-subtitle">{mode === 'login' ? 'Pick up right where you left off.' : 'A clearer view of your financial future.'}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && <label className="form-label" htmlFor="auth-name">Full name<input id="auth-name" autoComplete="name" className="form-input" name="name" placeholder="Alex Johnson" required /></label>}
          <label className="form-label" htmlFor="auth-email">Email address<input ref={emailRef} id="auth-email" autoComplete="email" className="form-input" name="email" placeholder="you@example.com" required type="email" /></label>
          <label className="form-label" htmlFor="auth-password">Password<input ref={passwordRef} id="auth-password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className="form-input" name="password" placeholder="At least 8 characters" required type="password" /></label>
          {mode === 'signup' && <label className="form-label" htmlFor="auth-confirm">Confirm password<input id="auth-confirm" autoComplete="new-password" className="form-input" name="confirmPassword" placeholder="Enter your password again" required type="password" /></label>}
          {error && <p className="form-error" role="alert">{error}</p>}
          {mode === 'login' && <div className="demo-credentials"><strong>Demo credentials</strong><span>Email <code>{DEMO_EMAIL}</code></span><span>Password <code>{DEMO_PASSWORD}</code></span><button type="button" onClick={fillDemo}>Fill demo details</button></div>}
          <button className="button button-accent auth-submit" type="submit">{mode === 'login' ? 'Log in to Northstar' : 'Create free account'}</button>
        </form>
        <p className="auth-switch">{mode === 'login' ? 'New to Northstar?' : 'Already have an account?'} <button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>{mode === 'login' ? 'Create an account' : 'Log in'}</button></p>
      </section>
    </div>
  );
}
