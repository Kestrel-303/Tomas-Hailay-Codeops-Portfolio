import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <section className="page-section container">
      <p className="page-section__eyebrow">Your Account</p>
      <h1 className="page-section__title">Hello, {user.name}</h1>
      <p className="page-section__body">Signed in as {user.email}</p>
      <button type="button" className="btn" onClick={handleLogout} style={{ marginTop: "1.5rem" }}>
        Sign Out
      </button>
    </section>
  );
}
