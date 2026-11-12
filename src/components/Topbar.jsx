import { useState } from 'react';
import { FiBell, FiChevronDown, FiMenu, FiSearch, FiUser, FiX } from 'react-icons/fi';
import Brand from './Brand';

export default function Topbar({
  search,
  onSearch,
  onLogin,
  onSignup,
  isLoggedIn,
  onMenu,
  onHome,
  notifications,
  onDismissNotification,
  onDismissAllNotifications,
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="topbar">
      <button className="mobile-menu icon-button" type="button" aria-label="Open navigation" onClick={onMenu}>
        <FiMenu />
      </button>
      <Brand compact href="#home" onClick={(event) => { event.preventDefault(); onHome(); }} />
      <label className="search-field">
        <FiSearch aria-hidden="true" />
        <input
          aria-label="Search stocks"
          placeholder="Search stocks, markets..."
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
        <kbd>⌘ K</kbd>
      </label>
      <div className="topbar-actions">
        <span className="market-status"><i /> Market open</span>
        <div className="notification-wrap">
          <button
            className="icon-button notification-button"
            type="button"
            aria-label={`Notifications${notifications.length ? `, ${notifications.length} unread` : ''}`}
            aria-expanded={notificationsOpen}
            onClick={() => setNotificationsOpen((open) => !open)}
          >
            <FiBell />
            {notifications.length > 0 && <span className="notification-dot" />}
          </button>
          {notificationsOpen && (
            <section className="notification-popover" aria-label="Notifications">
              <div className="notification-heading">
                <div><strong>Notifications</strong><small>{notifications.length ? `${notifications.length} new updates` : 'You’re all caught up'}</small></div>
                <div className="notification-heading-actions">
                  {notifications.length > 0 && <button className="notification-clear" type="button" onClick={onDismissAllNotifications}>Clear all</button>}
                  <button className="notification-close" type="button" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)}><FiX /></button>
                </div>
              </div>
              {notifications.length > 0 ? (
                <div className="notification-list">
                  {notifications.map((notification) => (
                    <article className="notification-item" key={notification.id}>
                      <span className={`notification-indicator ${notification.tone}`} />
                      <div><strong>{notification.title}</strong><p>{notification.message}</p><small>{notification.time}</small></div>
                      <button className="notification-close" type="button" aria-label={`Dismiss ${notification.title}`} onClick={() => onDismissNotification(notification.id)}><FiX /></button>
                    </article>
                  ))}
                </div>
              ) : <p className="notification-empty">New market updates will appear here.</p>}
            </section>
          )}
        </div>
        {isLoggedIn ? (
          <button className="user-button" type="button">
            <span className="avatar">AJ</span>
            <span>Alex Johnson</span>
            <FiChevronDown />
          </button>
        ) : (
          <div className="auth-actions">
            <button className="text-button" type="button" onClick={onLogin}><FiUser /> Log in</button>
            <button className="button button-small button-accent" type="button" onClick={onSignup}>Get started</button>
          </div>
        )}
      </div>
    </header>
  );
}
