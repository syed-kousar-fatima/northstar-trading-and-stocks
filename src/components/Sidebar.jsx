import {
  FiActivity,
  FiArrowLeft,
  FiBriefcase,
  FiGrid,
  FiHelpCircle,
  FiLogOut,
  FiPieChart,
  FiStar,
  FiTrendingUp,
} from 'react-icons/fi';
import Brand from './Brand';

const navigation = [
  { id: 'overview', label: 'Overview', icon: FiGrid },
  { id: 'markets', label: 'Markets', icon: FiTrendingUp },
  { id: 'watchlist', label: 'Watchlist', icon: FiStar },
  { id: 'portfolio', label: 'Portfolio', icon: FiPieChart },
  { id: 'activity', label: 'Activity', icon: FiActivity },
];

export default function Sidebar({ activeSection, onNavigate, onLogin, onHome, isLoggedIn, watchlistCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Brand href="#dashboard-overview" />
        <span className="live-tag"><i /> LIVE MARKETS</span>
      </div>
      <button className="sidebar-back-link" type="button" onClick={onHome} aria-label="Back to landing page" title="Back to landing page">
        <FiArrowLeft aria-hidden="true" />
        <span>Back to landing</span>
      </button>
      <div className="nav-caption">WORKSPACE</div>
      <nav className="side-nav" aria-label="Dashboard sections">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            className={`nav-link${activeSection === id ? ' active' : ''}`}
            key={id}
            onClick={() => onNavigate(id)}
            type="button"
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
            {id === 'watchlist' && watchlistCount > 0 && <small>{watchlistCount}</small>}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-help">
          <div className="help-icon"><FiHelpCircle /></div>
          <strong>Need a hand?</strong>
          <p>Our team is here to help you invest with confidence.</p>
          <button type="button" onClick={() => window.alert('Support is available at hello@northstar.demo.')}>Get support <span>↗</span></button>
        </div>
        <button className="account-row" type="button" onClick={onLogin}>
          <span className="avatar">AJ</span>
          <span className="account-copy">
            <strong>{isLoggedIn ? 'Alex Johnson' : 'Guest account'}</strong>
            <small>{isLoggedIn ? 'Personal account' : 'Demo workspace'}</small>
          </span>
          {isLoggedIn ? <FiLogOut className="account-action" /> : <FiBriefcase className="account-action" />}
        </button>
      </div>
    </aside>
  );
}
