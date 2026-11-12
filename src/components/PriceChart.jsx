import { useMemo } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { formatCurrency } from '../utils/formatters';

const ranges = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

function chartValues(stock, range) {
  const source = stock.values;
  const shift = ranges.indexOf(range) * 2;
  return source.map((value, index) => {
    const adjusted = value + Math.sin(index * 1.8 + shift) * (range === '1D' ? 3 : 6);
    return Math.max(12, Math.min(93, adjusted));
  });
}

export default function PriceChart({ stock, range, onRangeChange, onTrade }) {
  const values = useMemo(() => chartValues(stock, range), [stock, range]);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${100 - value}`).join(' ');
  const fillPoints = `0,100 ${points} 100,100`;
  const positive = stock.change >= 0;

  return (
    <section className="panel chart-panel">
      <div className="panel-heading chart-heading">
        <div>
          <div className="chart-stock-title">
            <span className="stock-symbol-icon" style={{ '--stock-color': stock.color }}>{stock.symbol.slice(0, 1)}</span>
            <span><strong>{stock.name}</strong><small>{stock.symbol} · NASDAQ</small></span>
          </div>
        </div>
        <div className="chart-actions">
          <button className="button button-outline chart-buy" type="button" onClick={() => onTrade('Buy', stock)}>Buy / Sell</button>
          <button className="icon-button more-button" type="button" aria-label="More chart actions">···</button>
        </div>
      </div>
      <div className="chart-price-line">
        <strong className="chart-price">{formatCurrency(stock.price)}</strong>
        <span className={`change-pill ${positive ? 'up' : 'down'}`}><FiArrowUpRight /> {positive ? '+' : ''}{stock.change.toFixed(2)}%</span>
        <span className="chart-period-label">Today</span>
      </div>
      <div className="chart-area" aria-label={`${stock.symbol} price chart`}>
        <div className="chart-y-labels"><span>$150</span><span>$145</span><span>$140</span><span>$135</span><span>$130</span></div>
        <svg className="price-svg" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`Price trend for ${stock.name}`}>
          <defs>
            <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#b9f5d0" stopOpacity=".24" />
              <stop offset="100%" stopColor="#b9f5d0" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 25, 50, 75, 100].map((line) => <line key={line} x1="0" x2="100" y1={line} y2={line} className="chart-grid-line" />)}
          <polygon points={fillPoints} fill="url(#chartFill)" className="chart-fill" />
          <polyline points={points} fill="none" className="chart-line" pathLength="1" />
          <circle cx="100" cy={100 - values[values.length - 1]} r="1.45" className="chart-point" />
        </svg>
        <div className="chart-x-labels"><span>9:30 AM</span><span>11:00 AM</span><span>12:30 PM</span><span>2:00 PM</span><span>4:00 PM</span></div>
      </div>
      <div className="chart-footer">
        <div className="range-tabs" role="group" aria-label="Chart range">
          {ranges.map((item) => (
            <button className={range === item ? 'selected' : ''} key={item} type="button" onClick={() => onRangeChange(item)}>{item}</button>
          ))}
        </div>
        <span className="chart-footer-note"><i /> Live demo data</span>
      </div>
    </section>
  );
}
