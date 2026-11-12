import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiClock,
  FiDownload,
  FiPlus,
  FiTrendingUp,
} from 'react-icons/fi';
import AuthModal from './components/AuthModal';
import PriceChart from './components/PriceChart';
import { IndexStrip, PortfolioSummary, StockTable, WatchlistPanel } from './components/MarketWidgets';
import LandingPage from './pages/LandingPage';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import TradeModal from './components/TradeModal';
import { initialPositions, initialTransactions, marketIndices, getStock, stocks, watchlistSymbols } from './data/marketData';
import { formatCurrency, formatNumber } from './utils/formatters';
import './index.css';

const pageTitles = {
  overview: ['Your money, in motion.', 'Here’s what’s happening with your portfolio today.'],
  markets: ['Explore the markets.', 'Find your next opportunity in today’s market.'],
  watchlist: ['Your watchlist.', 'All the stocks you’re keeping an eye on.'],
  portfolio: ['Your portfolio.', 'A closer look at your investments and buying power.'],
  activity: ['Your activity.', 'A clear record of every move in your demo account.'],
};

const initialNotifications = [
  { id: 1, title: 'Market snapshot is ready', message: 'Your daily market overview has been refreshed.', time: 'Just now', tone: 'mint' },
  { id: 2, title: 'NVDA is trending', message: 'NVIDIA is up 3.42% in today’s demo market.', time: '12 min ago', tone: 'blue' },
  { id: 3, title: 'A watchlist idea', message: 'Add a stock from Markets to keep it close.', time: '1 hr ago', tone: 'purple' },
];

function MetricCard({ label, value, note, change, icon: Icon, tone = 'mint', spark = false }) {
  return (
    <article className="metric-card panel">
      <div className="metric-topline"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon /></span></div>
      <strong className="metric-value">{value}</strong>
      <div className="metric-bottom">
        <span className={`metric-change ${change >= 0 ? 'positive' : 'negative'}`}>{change >= 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}{change >= 0 ? '+' : ''}{change}%</span>
        <span>{note}</span>
        {spark && <svg className="metric-spark" viewBox="0 0 74 28" aria-hidden="true"><polyline points="0,23 10,18 18,21 29,12 40,16 50,8 60,12 74,3" /></svg>}
      </div>
    </article>
  );
}

function ActivityPanel({ transactions, onSeeAll }) {
  return (
    <section className="panel activity-panel">
      <div className="panel-heading">
        <div><h2>Recent activity</h2><p>Your latest demo transactions</p></div>
        {onSeeAll && <button className="link-button" type="button" onClick={onSeeAll}>View all <FiArrowUpRight /></button>}
      </div>
      {transactions.length ? (
        <div className="activity-list">
          {transactions.slice(0, 4).map((transaction) => (
            <div className="activity-item" key={transaction.id}>
              <span className={`activity-icon ${transaction.type.toLowerCase()}`}>{transaction.type === 'Buy' ? <FiArrowDownRight /> : <FiArrowUpRight />}</span>
              <span className="activity-description"><strong>{transaction.type} {transaction.symbol}</strong><small>{transaction.date} · {transaction.shares} shares</small></span>
              <span className="activity-total"><strong>{formatCurrency(transaction.price * transaction.shares)}</strong><small>{transaction.status}</small></span>
            </div>
          ))}
        </div>
      ) : <div className="empty-state">No trades yet. Use a Buy / Sell button to place a demo order.</div>}
    </section>
  );
}

function SectionHeading({ title, description, action }) {
  return (
    <div className="section-heading">
      <div><h2>{title}</h2><p>{description}</p></div>
      {action}
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedSymbol, setSelectedSymbol] = useState('NVDA');
  const [range, setRange] = useState('1D');
  const [watchlist, setWatchlist] = useState(watchlistSymbols);
  const [positions, setPositions] = useState(initialPositions);
  const [cash, setCash] = useState(24580);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState('');
  const [trade, setTrade] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const splashTimerRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showHomeNotice, setShowHomeNotice] = useState(true);
  const [notifications, setNotifications] = useState(initialNotifications);
  const selectedStock = getStock(selectedSymbol);
  const filteredStocks = useMemo(() => stocks.filter((stock) => (
    `${stock.symbol} ${stock.name} ${stock.sector}`.toLowerCase().includes(search.toLowerCase())
  )), [search]);
  const watchlistStocks = stocks.filter((stock) => watchlist.includes(stock.symbol));
  const gainers = stocks.filter((stock) => stock.change > 0).sort((a, b) => b.change - a.change);
  const losers = stocks.filter((stock) => stock.change < 0).sort((a, b) => a.change - b.change);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 850);
    splashTimerRef.current = timer;
    const handleScroll = () => setShowBackToTop(window.scrollY > 420);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      splashTimerRef.current = null;
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function finishLogin(mode) {
    setIsLoggedIn(true);
    setAuthMode(null);
    setCurrentPage('home');
    setMobileNavOpen(false);
    if (mode === 'login') {
      if (splashTimerRef.current !== null) window.clearTimeout(splashTimerRef.current);
      setShowSplash(true);
      splashTimerRef.current = window.setTimeout(() => {
        setShowSplash(false);
        splashTimerRef.current = null;
      }, 850);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function navigate(section) {
    setActiveSection(section);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openDashboard() {
    setCurrentPage('dashboard');
    setActiveSection('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function returnHome() {
    setCurrentPage('home');
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectStock(stock) {
    setSelectedSymbol(stock.symbol);
    if (activeSection !== 'markets') setActiveSection('markets');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleWatch(symbol) {
    setWatchlist((current) => current.includes(symbol)
      ? current.filter((item) => item !== symbol)
      : [...current, symbol]);
  }

  function placeTrade(order) {
    const total = order.shares * order.price;
    setCash((current) => current + (order.side === 'Buy' ? -total : total));
    setPositions((current) => {
      const currentPosition = current.find((position) => position.symbol === order.symbol);
      if (order.side === 'Buy') {
        if (currentPosition) {
          return current.map((position) => position.symbol === order.symbol
            ? {
              ...position,
              average: ((position.average * position.shares) + total) / (position.shares + order.shares),
              shares: position.shares + order.shares,
            }
            : position);
        }
        return [...current, { symbol: order.symbol, shares: order.shares, average: order.price }];
      }
      return current.map((position) => position.symbol === order.symbol
        ? { ...position, shares: position.shares - order.shares }
        : position).filter((position) => position.shares > 0);
    });
    setTransactions((current) => [{
      id: Date.now(),
      type: order.side,
      symbol: order.symbol,
      shares: order.shares,
      price: order.price,
      date: 'Just now',
      status: 'Completed',
    }, ...current]);
  }

  function openTrade(side, stock) {
    setTrade({ side, stock });
  }

  function renderPage() {
    const title = pageTitles[activeSection][0];
    if (activeSection === 'markets') {
      return (
        <>
          <SectionHeading title="Market overview" description="Explore live market movements with demo data." action={<button className="button button-outline" type="button" onClick={() => openTrade('Buy', selectedStock)}><FiPlus /> Place an order</button>} />
          <IndexStrip indices={marketIndices} />
          <div className="market-mover-grid">
            <StockTable title="Top gainers" stocks={gainers.slice(0, 4)} watchlist={watchlist} onToggleWatch={toggleWatch} onSelect={selectStock} showWatchButton />
            <StockTable title="Top losers" stocks={losers.slice(0, 4)} watchlist={watchlist} onToggleWatch={toggleWatch} onSelect={selectStock} showWatchButton />
          </div>
          <div className="market-detail-grid">
            <PriceChart stock={selectedStock} range={range} onRangeChange={setRange} onTrade={(side) => openTrade(side, selectedStock)} />
            <div className="market-side-column">
              <div className="detail-card panel">
                <div className="detail-card-top"><span className="stock-symbol-icon" style={{ '--stock-color': selectedStock.color }}>{selectedStock.symbol.slice(0, 1)}</span><span><strong>{selectedStock.symbol}</strong><small>{selectedStock.sector}</small></span><span className={`table-change ${selectedStock.change >= 0 ? 'positive' : 'negative'}`}>{selectedStock.change >= 0 ? '+' : ''}{selectedStock.change}%</span></div>
                <h3>{selectedStock.name}</h3>
                <strong className="detail-price">{formatCurrency(selectedStock.price)}</strong>
                <span className="muted-cell">Market cap ${selectedStock.cap}</span>
                <div className="detail-stats"><div><span>Open</span><strong>{formatCurrency(selectedStock.price * 0.99)}</strong></div><div><span>Previous close</span><strong>{formatCurrency(selectedStock.price * 0.98)}</strong></div><div><span>Sector</span><strong>{selectedStock.sector}</strong></div><div><span>Exchange</span><strong>NASDAQ</strong></div></div>
                <div className="detail-actions"><button className="button button-accent" type="button" onClick={() => openTrade('Buy', selectedStock)}>Buy {selectedStock.symbol}</button><button className="button button-outline" type="button" onClick={() => openTrade('Sell', selectedStock)}>Sell</button></div>
              </div>
              <WatchlistPanel stocks={watchlistStocks} onSelect={selectStock} onSeeAll={() => navigate('watchlist')} />
            </div>
          </div>
          <StockTable title="All stocks" stocks={filteredStocks} watchlist={watchlist} onToggleWatch={toggleWatch} onSelect={selectStock} showWatchButton />
        </>
      );
    }

    if (activeSection === 'watchlist') {
      return (
        <>
          <SectionHeading title="Your watchlist" description={`${watchlist.length} stocks saved to your personal market radar.`} />
          <div className="section-metrics"><MetricCard label="Stocks followed" value={watchlist.length} note="in your watchlist" change={2.4} icon={FiTrendingUp} /><MetricCard label="Best performer" value={gainers[0]?.symbol ?? '—'} note={gainers[0] ? `+${gainers[0].change}% today` : 'No movers yet'} change={gainers[0]?.change ?? 0} icon={FiArrowUpRight} tone="blue" /><MetricCard label="Market status" value="Open" note="NASDAQ · 4:00 PM ET" change={0.82} icon={FiClock} tone="purple" /></div>
          <StockTable title="Following" stocks={watchlistStocks} watchlist={watchlist} onToggleWatch={toggleWatch} onSelect={selectStock} showWatchButton />
          <StockTable title="Explore more stocks" stocks={stocks.filter((stock) => !watchlist.includes(stock.symbol)).slice(0, 4)} watchlist={watchlist} onToggleWatch={toggleWatch} onSelect={selectStock} showWatchButton />
        </>
      );
    }

    if (activeSection === 'portfolio') {
      const portfolioValue = positions.reduce((total, position) => total + getStock(position.symbol).price * position.shares, 0);
      return (
        <>
          <SectionHeading title="Portfolio overview" description="Track your holdings, returns, and available cash." action={<button className="button button-accent" type="button" onClick={() => openTrade('Buy', selectedStock)}><FiPlus /> New trade</button>} />
          <div className="section-metrics"><MetricCard label="Portfolio value" value={formatCurrency(portfolioValue, 0)} note="across all holdings" change={2.84} icon={FiPieIcon} /><MetricCard label="Available cash" value={formatCurrency(cash, 0)} note="ready to invest" change={0.4} icon={FiDownload} tone="blue" /><MetricCard label="Invested assets" value={positions.length} note="stocks in portfolio" change={1.2} icon={FiTrendingUp} tone="purple" /></div>
          <div className="portfolio-page-grid">
            <PortfolioSummary positions={positions} stocks={stocks} cash={cash} onSelect={selectStock} />
            <ActivityPanel transactions={transactions} onSeeAll={() => navigate('activity')} />
          </div>
          <StockTable title="Your holdings" stocks={positions.map((position) => getStock(position.symbol))} watchlist={watchlist} onToggleWatch={toggleWatch} onSelect={selectStock} />
        </>
      );
    }

    if (activeSection === 'activity') {
      return (
        <>
          <SectionHeading title="Transaction history" description="Every simulated order, all in one place." action={<span className="demo-badge">DEMO ACCOUNT</span>} />
          <ActivityPanel transactions={transactions} />
          <div className="panel activity-note"><span className="note-icon"><FiClock /></span><div><strong>Practice makes progress</strong><p>All activity is saved only in this browser session. No real money or market orders are involved.</p></div></div>
        </>
      );
    }

    return (
      <>
        <div className="welcome-row">
          <div><div className="eyebrow"><span className="live-dot" /> WEDNESDAY, OCTOBER 23, 2025</div><h1>{title}</h1><p>{pageTitles.overview[1]}</p></div>
          <div className="welcome-actions"><button className="button button-outline" type="button" onClick={() => navigate('markets')}>Explore markets <FiArrowUpRight /></button><button className="button button-accent" type="button" onClick={() => openTrade('Buy', selectedStock)}><FiPlus /> New trade</button></div>
        </div>
        <IndexStrip indices={marketIndices} />
        <div className="section-metrics">
          <MetricCard label="Total portfolio value" value={formatCurrency(cash + positions.reduce((total, position) => total + getStock(position.symbol).price * position.shares, 0), 0)} note="vs. last month" change={2.84} icon={FiPieIcon} spark />
          <MetricCard label="Today’s return" value="+$482.50" note="vs. yesterday" change={1.76} icon={FiTrendingUp} tone="blue" spark />
          <MetricCard label="Buying power" value={formatCurrency(cash, 0)} note="available to invest" change={0.4} icon={FiDownload} tone="purple" spark />
          <MetricCard label="Total return" value="+$2,184.20" note="all time" change={8.62} icon={FiArrowUpRight} tone="gold" spark />
        </div>
        <div className="dashboard-main-grid">
          <PriceChart stock={selectedStock} range={range} onRangeChange={setRange} onTrade={(side) => openTrade(side, selectedStock)} />
          <div className="dashboard-side-column">
            <PortfolioSummary positions={positions} stocks={stocks} cash={cash} onSeeAll={() => navigate('portfolio')} onSelect={selectStock} />
            <WatchlistPanel stocks={watchlistStocks} onSelect={selectStock} onSeeAll={() => navigate('watchlist')} />
          </div>
        </div>
        <div className="market-mover-grid">
          <StockTable title="Top gainers" stocks={gainers.slice(0, 4)} watchlist={watchlist} onToggleWatch={toggleWatch} onSelect={selectStock} onSeeAll={() => navigate('markets')} showWatchButton />
          <StockTable title="Top losers" stocks={losers.slice(0, 4)} watchlist={watchlist} onToggleWatch={toggleWatch} onSelect={selectStock} onSeeAll={() => navigate('markets')} showWatchButton />
        </div>
        <ActivityPanel transactions={transactions} onSeeAll={() => navigate('activity')} />
      </>
    );
  }

  return (
    <>
      {showSplash && <div className="splash-screen"><div className="splash-brand"><span className="splash-mark">↗</span><strong>northstar<span>.</span></strong></div><div className="splash-progress"><i /></div><small>MAKING YOUR MONEY MOVE</small></div>}
      {currentPage === 'home' ? (
        <LandingPage
          onDashboard={openDashboard}
          onLogin={() => setAuthMode('login')}
          onSignup={() => setAuthMode('signup')}
          showNotice={showHomeNotice}
          onDismissNotice={() => setShowHomeNotice(false)}
        />
      ) : (
        <div className={`app-shell${mobileNavOpen ? ' nav-open' : ''}`}>
          <Sidebar activeSection={activeSection} onNavigate={navigate} onLogin={() => setAuthMode('login')} onHome={returnHome} isLoggedIn={isLoggedIn} watchlistCount={watchlist.length} />
          {mobileNavOpen && <button className="mobile-nav-scrim" type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
          <div className="workspace">
            <Topbar
              search={search}
              onSearch={setSearch}
              onLogin={() => setAuthMode('login')}
              onSignup={() => setAuthMode('signup')}
              isLoggedIn={isLoggedIn}
              onMenu={() => setMobileNavOpen((current) => !current)}
              onHome={returnHome}
              notifications={notifications}
              onDismissNotification={(id) => setNotifications((current) => current.filter((notification) => notification.id !== id))}
              onDismissAllNotifications={() => setNotifications([])}
            />
            <main className="main-content" id="main-content">
              <div className="content-wrap">
                <div id={`dashboard-${activeSection}`} className={`page-content page-${activeSection}`} key={activeSection}>
                  {activeSection !== 'overview' && <div className="eyebrow page-eyebrow"><span className="live-dot" /> NORTHSTAR MARKETS</div>}
                  {renderPage()}
                </div>
                <footer className="site-footer"><span>© 2025 Northstar Financial, Inc.</span><span>Investing involves risk. This is a demo experience, not financial advice.</span><a href="#overview" onClick={(event) => { event.preventDefault(); navigate('overview'); }}>Back to overview ↑</a></footer>
              </div>
            </main>
          </div>
        </div>
      )}
      {showBackToTop && currentPage === 'dashboard' && <button className="back-to-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑</button>}
      {trade && <TradeModal stock={trade.stock} initialSide={trade.side} cash={cash} position={positions.find((position) => position.symbol === trade.stock.symbol)} onClose={() => setTrade(null)} onSubmit={placeTrade} />}
      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onSuccess={finishLogin} />}
    </>
  );
}

function FiPieIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d="M12 3v9h9A9 9 0 1 1 12 3Z" /><path d="M16 3.8A9 9 0 0 1 21 9h-9V3" /></svg>;
}

export default App;
