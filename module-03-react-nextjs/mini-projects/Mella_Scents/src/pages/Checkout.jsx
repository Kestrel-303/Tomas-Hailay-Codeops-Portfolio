import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { validate } from "../utils/validate";
import Field from "../components/Field";
import "./Checkout.css";

const DELIVERY_AREAS = [
  "Bole",
  "Kazanchis",
  "Megenagna",
  "Piassa",
  "Sarbet",
  "CMC",
  "Old Airport",
  "4 Kilo",
  "Gotera",
  "Ayat",
];

const INITIAL_FORM = { name: "", phone: "", area: "Bole", notes: "" };

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.totalPrice());
  const clearCart = useCartStore((state) => state.clearCart);

  const [form, setForm] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const errors = validate(form);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setServerError("");

    setTouched({ name: true, phone: true, area: true });

    const validationErrors = validate(form);
    const firstErrorKey = Object.keys(validationErrors)[0];

    if (firstErrorKey) {
      document.getElementById(firstErrorKey)?.focus();
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const succeeded = Math.random() > 0.1;

      if (!succeeded) {
        setSubmitting(false);
        setServerError("We couldn't reach TeleBirr. Please try again.");
        return;
      }

      clearCart();
      setSubmitting(false);
      navigate("/receipt", { state: { order: form, total } });
    }, 1200);
  };

  const isCartEmpty = items.length === 0;
  const formattedTotal = total.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <section className="page-section container checkout-page">
      <p className="page-section__eyebrow">Secure Checkout</p>
      <h1 className="page-section__title">Delivery &amp; Payment</h1>

      {isCartEmpty && (
        <div className="empty-state">
          <p className="page-section__body">Your bag is empty — add a fragrance before checking out.</p>
          <Link to="/shop" className="btn btn-solid">
            Explore the Collection
          </Link>
        </div>
      )}

      {!isCartEmpty && (
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <Field id="name" label="Full Name" error={errors.name} touched={touched.name}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Abebe Kebede"
            />
          </Field>

          <Field id="phone" label="TeleBirr Phone Number" error={errors.phone} touched={touched.phone}>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="09XXXXXXXX"
            />
          </Field>

          <Field id="area" label="Addis Ababa Sub-City" error={errors.area} touched={touched.area}>
            <select name="area" value={form.area} onChange={handleChange} onBlur={handleBlur}>
              {DELIVERY_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </Field>

          <Field id="notes" label="Delivery Notes (optional)" error={null} touched={false}>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="3"
              placeholder="Gate code, nearby landmark, etc."
            />
          </Field>

          {serverError && (
            <p role="alert" className="checkout-form__server-error">
              {serverError}
            </p>
          )}

          <button type="submit" className="btn btn-solid" disabled={submitting || isCartEmpty}>
            {submitting ? "Processing…" : `Pay ETB ${formattedTotal} with TeleBirr`}
          </button>
        </form>
      )}
    </section>
  );
}
