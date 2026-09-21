"use client";

export default function MenuError({ error, reset }) {
  return (
    <div className="page">
      <div className="status-card status-error">
        <span className="status-icon" aria-hidden="true">
          ⚠️
        </span>
        <h1 className="page-title">Something went wrong</h1>
        <p className="page-subtitle">{error.message}</p>
        <button type="button" className="btn btn-primary" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
