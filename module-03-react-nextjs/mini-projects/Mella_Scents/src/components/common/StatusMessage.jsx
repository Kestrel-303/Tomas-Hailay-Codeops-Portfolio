import "./StatusMessage.css";

export function LoadingMessage({ label = "Loading fragrances…" }) {
  return <p className="status-message status-message--loading">{label}</p>;
}

export function ErrorMessage({ message = "Something went wrong." }) {
  return <p className="status-message status-message--error">{message}</p>;
}

export function EmptyMessage({ message = "No fragrances found." }) {
  return <p className="status-message">{message}</p>;
}
