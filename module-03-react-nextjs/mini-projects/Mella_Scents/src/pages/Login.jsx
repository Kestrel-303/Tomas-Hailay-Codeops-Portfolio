import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? "/account";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    login({ name: name.trim(), email: email.trim() });
    navigate(redirectTo, { replace: true });
  };

  return (
    <section className="page-section container login-page">
      <p className="page-section__eyebrow">Welcome Back</p>
      <h1 className="page-section__title">Sign In</h1>
      <p className="page-section__body">
        Sign in to save fragrances to your wishlist and view your account.
      </p>

      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-form__field">
          <span>Name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Jane Doe"
          />
        </label>

        <label className="login-form__field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="jane@example.com"
            required
          />
        </label>

        {error && <p className="login-form__error">{error}</p>}

        <button type="submit" className="btn btn-solid">
          Sign In
        </button>
      </form>
    </section>
  );
}
