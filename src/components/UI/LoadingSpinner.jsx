const LoadingSpinner = ({ full = true }) => {
  if (!full) return (
    <div className="spinner-wrap">
      <div className="spinner" />
    </div>
  );
  return (
    <div className="loading-page">
      <div className="loading-logo">
        <span className="logo-icon">⚽</span>
        <span className="logo-text">SportNest</span>
      </div>
      <p className="loading-msg">Please wait while we prepare your data.</p>
    </div>
  );
};
export default LoadingSpinner;
