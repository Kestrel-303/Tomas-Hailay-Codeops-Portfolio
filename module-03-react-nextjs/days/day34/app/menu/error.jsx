"use client";

export default function MenuError({ error, reset }) {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
