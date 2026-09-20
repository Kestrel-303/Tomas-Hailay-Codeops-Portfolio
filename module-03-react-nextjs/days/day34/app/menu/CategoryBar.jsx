export default function CategoryBar({ categories }) {
  return (
    <div className="pill-row">
      {categories.map((category) => (
        <span key={category} className="pill">
          {category}
        </span>
      ))}
    </div>
  );
}
