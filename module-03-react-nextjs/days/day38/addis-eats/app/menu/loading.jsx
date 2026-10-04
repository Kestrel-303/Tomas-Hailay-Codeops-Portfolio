export default function MenuLoading() {
  return (
    <div className="page">
      <div className="page-header">
        <span className="eyebrow">Menu</span>
        <h1 className="page-title">Our dishes</h1>
      </div>

      <div className="pill-row">
        <span className="skeleton" style={{ width: "70px", height: "28px", borderRadius: "999px" }} />
        <span className="skeleton" style={{ width: "90px", height: "28px", borderRadius: "999px" }} />
        <span className="skeleton" style={{ width: "60px", height: "28px", borderRadius: "999px" }} />
      </div>

      <div className="dish-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="dish-card" style={{ gap: "0.6rem" }}>
            <span className="skeleton" style={{ width: "70%", height: "1.1rem" }} />
            <span className="skeleton" style={{ width: "40%", height: "0.85rem" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
