import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="not-found">
      <span className="eyebrow">404 · NOT FOUND</span>
      <h1>This route doesn’t exist.</h1>
      <p>The page may have moved or the URL may be incorrect.</p>
      <Link className="button-primary" to="/">
        Back to home
      </Link>
    </div>
  );
}
