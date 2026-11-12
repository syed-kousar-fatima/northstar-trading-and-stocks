import { FiArrowRight, FiArrowUpRight, FiCheck, FiX } from 'react-icons/fi';
import Brand from '../components/Brand';
import { IndexStrip } from '../components/MarketWidgets';
import { marketIndices, stocks } from '../data/marketData';
import { formatCurrency } from '../utils/formatters';
import './landing.css';

const gainers = stocks.filter((stock) => stock.change > 0).sort((a, b) => b.change - a.change).slice(0, 3);

const features = [
  { number: '01', title: 'See the bigger picture', description: 'Bring market movement and your personal portfolio into one calm, clear view.' },
  { number: '02', title: 'Build your conviction', description: 'Follow companies you care about and explore price trends on your own terms.' },
  { number: '03', title: 'Practice without pressure', description: 'Try a buy or sell order in a simulated portfolio. No real money, no surprises.' },
];

export default function LandingPage({ onDashboard, onLogin, onSignup, showNotice, onDismissNotice }) {
  return (
    <div className="landing-page" id="home">
      <header className="landing-nav">
        <Brand href="#home" />
        <nav className="landing-links" aria-label="Main navigation">
          <a className="landing-dashboard-link" href="#dashboard" onClick={(event) => { event.preventDefault(); onDashboard(); }}>Dashboard <FiArrowUpRight /></a>
        </nav>
        <div className="landing-auth">
          <button className="landing-login" type="button" onClick={onLogin}>Log in</button>
          <button className="button button-accent landing-signup" type="button" onClick={onSignup}>Sign up <FiArrowRight /></button>
        </div>
      </header>

      <main>
        {showNotice && (
          <div className="landing-notice" role="status">
            <span className="notice-live-dot" />
            <p><strong>Market is open</strong><span>Follow today’s movement with Northstar’s live-style demo dashboard.</span></p>
            <button type="button" aria-label="Close market update" onClick={onDismissNotice}><FiX /></button>
          </div>
        )}

        <section className="landing-hero">
          <div className="landing-orbit orbit-one" />
          <div className="landing-orbit orbit-two" />
          <div className="landing-hero-copy">
            <div className="landing-eyebrow"><span className="landing-eyebrow-dot" /> A CLEARER WAY TO INVEST</div>
            <h1>Make your next move<br />with <span>confidence.</span></h1>
            <p>Markets move fast. Your investing experience shouldn’t feel that way. Get the clarity to make every decision your own.</p>
            <div className="landing-hero-actions">
              <button className="button button-accent landing-primary" type="button" onClick={onDashboard}>Explore the dashboard <FiArrowRight /></button>
              <span><FiCheck /> Free demo · No real trades</span>
            </div>
            <div className="landing-proof"><span className="proof-avatars"><i>A</i><i>M</i><i>J</i></span><span><strong>Built for thoughtful investors</strong><small>Clear tools. Calm decisions.</small></span></div>
          </div>
          <div className="landing-hero-visual" aria-label="Illustration of portfolio growth">
            <div className="floating-label label-top"><span className="label-dot" /> MARKET MOMENTUM <strong>+2.84%</strong></div>
            <div className="hero-chart-card">
              <div className="hero-chart-head"><span><small>YOUR PORTFOLIO</small><strong>$34,218.76</strong></span><span className="hero-chart-change">↗ 8.62%</span></div>
              <div className="hero-chart">
                <svg viewBox="0 0 480 210" preserveAspectRatio="none" role="img" aria-label="Illustrative rising portfolio chart">
                  <defs><linearGradient id="landing-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b9f5d0" stopOpacity=".25" /><stop offset="100%" stopColor="#b9f5d0" stopOpacity="0" /></linearGradient></defs>
                  {[0, 1, 2, 3].map((line) => <line key={line} x1="0" x2="480" y1={line * 60 + 15} y2={line * 60 + 15} className="landing-chart-grid" />)}
                  <path d="M0 166 C36 152 39 160 66 138 S100 149 128 117 S164 126 197 99 S227 118 260 81 S297 105 330 64 S361 84 391 49 S432 63 480 19 L480 210 L0 210Z" fill="url(#landing-fill)" />
                  <path d="M0 166 C36 152 39 160 66 138 S100 149 128 117 S164 126 197 99 S227 118 260 81 S297 105 330 64 S361 84 391 49 S432 63 480 19" className="landing-chart-line" />
                  <circle cx="480" cy="19" r="5" className="landing-chart-point" />
                </svg>
                <div className="landing-chart-labels"><span>SEP 01</span><span>SEP 15</span><span>OCT 01</span><span>OCT 15</span><span>TODAY</span></div>
              </div>
              <div className="hero-chart-footer"><span>Portfolio performance</span><span><i /> Demo data</span></div>
            </div>
            <div className="floating-label label-bottom"><span className="stock-symbol-icon small" style={{ '--stock-color': '#82c8ff' }}>N</span><span><small>TOP MOVER</small><strong>NVDA <em>+3.42%</em></strong></span><FiArrowUpRight /></div>
          </div>
        </section>

        <section className="landing-markets" id="market-snapshot">
          <div className="landing-section-heading">
            <div><span className="landing-eyebrow">A MOMENT IN THE MARKET</span><h2>Big-picture insight.<br /><span>Without the noise.</span></h2></div>
            <p>Get a quick feel for the day, then dig into the details when you’re ready.</p>
          </div>
          <IndexStrip indices={marketIndices} />
          <div className="landing-trending-head"><div><span className="landing-eyebrow">TRENDING NOW</span><h3>Stocks on the move</h3></div><button className="landing-text-link" type="button" onClick={onDashboard}>Explore all markets <FiArrowRight /></button></div>
          <div className="landing-stock-grid">
            {gainers.map((stock, index) => (
              <article className="landing-stock-card" key={stock.symbol}>
                <div className="landing-stock-top"><span className="stock-symbol-icon" style={{ '--stock-color': stock.color }}>{stock.symbol.slice(0, 1)}</span><span className="landing-stock-rank">0{index + 1}</span></div>
                <small>{stock.name}</small>
                <strong className="landing-stock-price">{formatCurrency(stock.price)}</strong>
                <div className="landing-stock-change"><span>Today</span><strong>+{stock.change.toFixed(2)}%</strong><svg viewBox="0 0 90 30" preserveAspectRatio="none" aria-hidden="true"><polyline points={stock.values.map((value, pointIndex) => `${(pointIndex / (stock.values.length - 1)) * 90},${30 - (value / 100) * 27}`).join(' ')} /></svg></div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-approach" id="why-northstar">
          <div className="landing-section-heading approach-heading">
            <div><span className="landing-eyebrow">THE NORTHSTAR APPROACH</span><h2>Your goals first.<br /><span>The market second.</span></h2></div>
            <p>We make the tools feel simpler, so you can focus on what matters: building a plan that feels right for you.</p>
          </div>
          <div className="landing-feature-grid">
            {features.map((feature) => (
              <article className="landing-feature-card" key={feature.number}>
                <span>{feature.number}</span><div className="feature-arrow">↗</div><h3>{feature.title}</h3><p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-cta" id="dashboard">
          <div><span className="landing-eyebrow">YOUR NEXT STEP</span><h2>Curiosity is a great<br />place to start.</h2><p>Explore the dashboard and see how a more considered market experience feels.</p></div>
          <button className="button button-accent landing-primary" type="button" onClick={onDashboard}>Open the demo dashboard <FiArrowRight /></button>
          <div className="cta-decoration">N<span>.</span></div>
        </section>
      </main>
      <footer className="landing-footer"><Brand compact href="#home" /><span>Demo experience · No real trades are placed.</span><a href="#market-snapshot">Market snapshot ↑</a></footer>
    </div>
  );
}
