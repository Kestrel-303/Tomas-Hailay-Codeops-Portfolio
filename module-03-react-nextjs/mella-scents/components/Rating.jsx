// Stars for a 0–5 rating, with the number in words for screen readers.
export default function Rating({ value }) {
  const rounded = Math.round(value * 10) / 10;
  const full = Math.round(value);
  return (
    <p className="rating">
      <span aria-hidden="true">{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>
      <span className="rating__value">
        {rounded.toFixed(1)}
        <span className="visually-hidden"> out of 5 stars</span>
      </span>
    </p>
  );
}
