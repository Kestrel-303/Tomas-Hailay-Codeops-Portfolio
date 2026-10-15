export default function DishListSkeleton() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div className="skeleton" style={{ width: '120px', height: '36px', borderRadius: 'var(--radius-full)' }} />
        <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: 'var(--radius-full)' }} />
        <div className="skeleton" style={{ width: '140px', height: '36px', borderRadius: 'var(--radius-full)' }} />
      </div>

      <div className="dish-grid">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="card dish-card" style={{ height: '320px' }}>
            <div className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }} />
            <div className="skeleton" style={{ height: '24px', width: '70%', marginBottom: '0.5rem' }} />
            <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '1rem' }} />
            <div className="skeleton" style={{ height: '40px', width: '100%', marginTop: 'auto' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
