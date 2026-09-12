import { cloneElement } from "react";
import "./Field.css";

export default function Field({ id, label, error, touched, children }) {
  const invalid = Boolean(touched && error);

  const input = cloneElement(children, {
    id,
    "aria-invalid": invalid,
    "aria-describedby": invalid ? `${id}-error` : undefined,
  });

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      {input}
      {invalid && (
        <p id={`${id}-error`} role="alert" className="field__error">
          {error}
        </p>
      )}
    </div>
  );
}
