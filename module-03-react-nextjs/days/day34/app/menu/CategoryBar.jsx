export default function CategoryBar({ categories }) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", margin: "1rem 0" }}>
      {categories.map((category) => (
        <span key={category} style={{ border: "1px solid #555", borderRadius: "999px", padding: "0.25rem 0.75rem" }}>
          {category}
        </span>
      ))}
    </div>
  );
}
