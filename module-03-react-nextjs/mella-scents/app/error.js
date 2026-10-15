'use client';

// The error boundary for every page: the header and footer stay, and nothing technical is shown.
export default function Error({ reset }) {
  return (
    <section className="page-section container">
      <p className="page-section__eyebrow">Something went wrong</p>
      <h1 className="page-section__title">We couldn&apos;t load this page</h1>
      <p className="page-section__body">Please try again. If it keeps happening, come back in a few minutes.</p>
      <button type="button" className="btn btn-solid" onClick={() => reset()} style={{ marginTop: '1.5rem' }}>
        Try again
      </button>
    </section>
  );
}
