import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__row">
        <p className="site-footer__brand">Mella Scents</p>
        <p className="site-footer__note">
          &copy; {new Date().getFullYear()} Mella Scents. Crafted fragrances, quietly luxurious.
        </p>
      </div>
    </footer>
  );
}
