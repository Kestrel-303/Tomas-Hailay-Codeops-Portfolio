import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page-section container">
      <p className="page-section__eyebrow">404</p>
      <h1 className="page-section__title">Page Not Found</h1>
      <p className="page-section__body">
        The page you're looking for doesn't exist.{" "}
        <Link to="/" className="btn" style={{ marginTop: "1rem" }}>
          Return Home
        </Link>
      </p>
    </section>
  );
}
