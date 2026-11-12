import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { formatCurrency } from '../utils/formatters';

export default function TradeModal({ stock, initialSide, cash, position, onClose, onSubmit }) {
  const [side, setSide] = useState(initialSide);
  const [quantity, setQuantity] = useState('1');
  const [priceInput, setPriceInput] = useState(stock.price.toFixed(2));
  const [error, setError] = useState('');
  const shares = Number(quantity);
  const price = Number(priceInput);
  const total = Number.isFinite(shares) && Number.isFinite(price) ? shares * price : 0;
  const maxSell = position?.shares ?? 0;

  function submitOrder(event) {
    event.preventDefault();
    if (!Number.isInteger(shares) || shares < 1) {
      setError('Enter a whole number of shares greater than zero.');
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setError('Enter a stock price greater than zero.');
      return;
    }
    if (side === 'Buy' && total > cash) {
      setError('Your demo cash balance is too low for this order.');
      return;
    }
    if (side === 'Sell' && shares > maxSell) {
      setError(`You can sell up to ${maxSell} shares from this demo portfolio.`);
      return;
    }
    setError('');
    onSubmit({ side, symbol: stock.symbol, shares, price });
    onClose();
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-card trade-modal" role="dialog" aria-modal="true" aria-labelledby="trade-title">
        <button className="modal-close" type="button" aria-label="Close order ticket" onClick={onClose}><FiX /></button>
        <div className="modal-eyebrow">PAPER TRADING · NO REAL ORDERS</div>
        <h2 id="trade-title">Place an order</h2>
        <p className="modal-subtitle">Practice a trade with your simulated portfolio.</p>
        <div className="trade-stock">
          <span className="stock-symbol-icon" style={{ '--stock-color': stock.color }}>{stock.symbol.slice(0, 1)}</span>
          <span><strong>{stock.name}</strong><small>{stock.symbol} · Current quote {formatCurrency(stock.price)}</small></span>
        </div>
        <div className="trade-tabs">
          {['Buy', 'Sell'].map((option) => <button key={option} type="button" className={side === option ? `selected ${option.toLowerCase()}` : ''} onClick={() => { setSide(option); setError(''); }}>{option}</button>)}
        </div>
        <form onSubmit={submitOrder}>
          <label className="form-label" htmlFor="trade-quantity">Quantity <span>Shares owned: {maxSell}</span></label>
          <input id="trade-quantity" className="form-input" inputMode="numeric" min="1" step="1" type="number" value={quantity} onChange={(event) => { setQuantity(event.target.value); setError(''); }} />
          <label className="form-label" htmlFor="trade-price">Stock price per share</label>
          <input id="trade-price" className="form-input" inputMode="decimal" min="0.01" step="0.01" type="number" value={priceInput} onChange={(event) => { setPriceInput(event.target.value); setError(''); }} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="order-summary">
            <div><span>Order type</span><strong>Demo order</strong></div>
            <div><span>Price per share</span><strong>{formatCurrency(Number.isFinite(price) ? price : 0)}</strong></div>
            <div><span>Estimated total</span><strong>{formatCurrency(total)}</strong></div>
            <div><span>Available cash</span><strong>{formatCurrency(cash, 0)}</strong></div>
          </div>
          <button className={`button trade-submit ${side === 'Buy' ? 'button-accent' : 'button-sell'}`} type="submit">{side} {stock.symbol}</button>
          <p className="trade-disclaimer">Demo only. This will not place a real market order.</p>
        </form>
      </section>
    </div>
  );
}
