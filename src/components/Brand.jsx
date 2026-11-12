export default function Brand({ compact = false, href = '#overview', onClick }) {
  return (
    <a className={`brand${compact ? ' brand-compact' : ''}`} href={href} onClick={onClick} aria-label="Northstar home">
      <svg className="brand-mark" viewBox="0 0 42 42" role="img" aria-label="Northstar logo">
        <rect width="42" height="42" rx="14" fill="#b9f5d0" />
        <path d="M12 27.5 19.1 20l5 4.8L31 14" fill="none" stroke="#101c19" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <path d="M24.8 14H31v6.2" fill="none" stroke="#101c19" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      </svg>
      {!compact && (
        <span className="brand-copy">
          <strong>northstar<span>.</span></strong>
          <small>INVEST WITH CLARITY</small>
        </span>
      )}
    </a>
  );
}
