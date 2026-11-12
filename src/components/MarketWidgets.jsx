import { FiArrowDownRight, FiArrowUpRight, FiChevronRight, FiPlus } from 'react-icons/fi';
import { formatCurrency, formatNumber } from '../utils/formatters';

function StockIdentity({ stock }) {
  return (
    <span className="stock-identity">
      <span className="stock-symbol-icon small" style={{ '--stock-color': stock.color }}>{stock.symbol.slice(0, 1)}</span>
      <span><strong>{stock.symbol}</strong><small>{stock.name}</small></span>
    </span>
  );
}

export function IndexStrip({ indices }) {
  return (
    <div className="index-strip">
      {indices.map((index) => (
        <div className="index-item" key={index.symbol}>
          <div className="index-title"><span>{index.name}</span><small>{index.symbol}</small></div>
          <strong>{index.value}</strong>
          <span className={`index-change ${index.positive ? 'positive' : 'negative'}`}>{index.positive ? <FiArrowUpRight /> : <FiArrowDownRight />}{index.change}</span>
        </div>
      ))}
    </div>
  );
}

export function StockTable({ title, stocks: stockItems, watchlist, onToggleWatch, onSelect, onSeeAll, showWatchButton = false }) {
  return (
    <section className="panel table-panel">
      <div className="panel-heading">
        <div><h2>{title}</h2><p>Keep an eye on the market’s biggest moves</p></div>
        {onSeeAll && <button className="link-button" type="button" onClick={onSeeAll}>View all <FiChevronRight /></button>}
      </div>
      <div className="table-scroll">
        <table className="stock-table">
          <thead><tr><th>ASSET</th><th>PRICE</th><th>24H CHANGE</th><th>MARKET CAP</th><th>7D TREND</th>{showWatchButton && <th />}</tr></thead>
          <tbody>
            {stockItems.map((stock) => (
              <tr key={stock.symbol} onClick={() => onSelect(stock)} className="stock-row">
                <td><StockIdentity stock={stock} /></td>
                <td className="number-cell">{formatCurrency(stock.price)}</td>
                <td><span className={`table-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%</span></td>
                <td className="muted-cell">${stock.cap}</td>
                <td><svg className={`sparkline ${stock.change >= 0 ? 'up' : 'down'}`} viewBox="0 0 78 28" preserveAspectRatio="none" aria-label={`${stock.symbol} weekly price trend`}>
                  <polyline points={stock.values.map((value, index) => `${(index / (stock.values.length - 1)) * 78},${28 - (value / 100) * 25}`).join(' ')} />
                </svg></td>
                {showWatchButton && (
                  <td><button
                    className={`watch-toggle${watchlist.includes(stock.symbol) ? ' selected' : ''}`}
                    type="button"
                    aria-label={`${watchlist.includes(stock.symbol) ? 'Remove' : 'Add'} ${stock.symbol} ${watchlist.includes(stock.symbol) ? 'from' : 'to'} watchlist`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleWatch(stock.symbol);
                    }}
                  >{watchlist.includes(stock.symbol) ? '★' : <FiPlus />}</button></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function WatchlistPanel({ stocks: stockItems, onSelect, onSeeAll }) {
  return (
    <section className="panel watchlist-panel">
      <div className="panel-heading">
        <div><h2>Your watchlist</h2><p>Stocks you’re following</p></div>
        {onSeeAll && <button className="link-button" type="button" onClick={onSeeAll}>See all <FiChevronRight /></button>}
      </div>
      <div className="watchlist-items">
        {stockItems.slice(0, 4).map((stock) => (
          <button className="watchlist-item" type="button" key={stock.symbol} onClick={() => onSelect(stock)}>
            <StockIdentity stock={stock} />
            <span className="watchlist-price"><strong>{formatCurrency(stock.price)}</strong><small className={stock.change >= 0 ? 'positive' : 'negative'}>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%</small></span>
            <svg className={`sparkline watch-sparkline ${stock.change >= 0 ? 'up' : 'down'}`} viewBox="0 0 64 26" preserveAspectRatio="none" aria-hidden="true">
              <polyline points={stock.values.map((value, index) => `${(index / (stock.values.length - 1)) * 64},${26 - (value / 100) * 23}`).join(' ')} />
            </svg>
          </button>
        ))}
        {!stockItems.length && <div className="empty-state">Your watchlist is empty. Add a stock from Markets.</div>}
      </div>
    </section>
  );
}

export function PortfolioSummary({ positions, stocks, cash, onSeeAll, onSelect }) {
  const totalInvested = positions.reduce((total, position) => {
    const stock = stocks.find((item) => item.symbol === position.symbol);
    return total + (stock ? stock.price * position.shares : 0);
  }, 0);
  const totalCost = positions.reduce((total, position) => total + position.average * position.shares, 0);
  const profit = totalInvested - totalCost;

  return (
    <section className="panel portfolio-panel">
      <div className="panel-heading">
        <div><h2>Portfolio</h2><p>Your investments at a glance</p></div>
        {onSeeAll && <button className="link-button" type="button" onClick={onSeeAll}>Details <FiChevronRight /></button>}
      </div>
      <div className="portfolio-total">
        <span>Total invested</span>
        <strong>{formatCurrency(totalInvested, 0)}</strong>
        <small className={profit >= 0 ? 'positive' : 'negative'}>{profit >= 0 ? '+' : ''}{formatCurrency(profit)} ({totalCost ? ((profit / totalCost) * 100).toFixed(2) : '0.00'}%) all time</small>
      </div>
      <div className="portfolio-bar" aria-label="Portfolio allocation">
        {positions.map((position, index) => {
          const stock = stocks.find((item) => item.symbol === position.symbol);
          const value = stock ? stock.price * position.shares : 0;
          return <span key={position.symbol} style={{ width: `${totalInvested ? (value / totalInvested) * 100 : 0}%`, background: ['#b9f5d0', '#88c9f3', '#ba9df5', '#f7c27c'][index % 4] }} />;
        })}
      </div>
      <div className="portfolio-holdings">
        {positions.slice(0, 3).map((position, index) => {
          const stock = stocks.find((item) => item.symbol === position.symbol);
          if (!stock) return null;
          const value = stock.price * position.shares;
          return (
            <button type="button" className="holding-line" key={position.symbol} onClick={() => onSelect(stock)}>
              <span className="holding-label"><i style={{ background: ['#b9f5d0', '#88c9f3', '#ba9df5', '#f7c27c'][index % 4] }} />{stock.symbol}<small>{position.shares} shares</small></span>
              <strong>{formatCurrency(value, 0)}</strong>
            </button>
          );
        })}
        <div className="holding-line cash-line"><span className="holding-label"><i />Available cash</span><strong>{formatCurrency(cash, 0)}</strong></div>
      </div>
      <span className="portfolio-hint">{formatNumber(positions.reduce((total, position) => total + position.shares, 0))} shares across {positions.length} assets</span>
    </section>
  );
}
