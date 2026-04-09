import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="header">
      <div className="container nav">
        <Link to="/" className="logo">CINECURA</Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/browse">Browse</Link>
          <Link to="/watchlist">Watchlist</Link>
          <Link to="/about">About</Link>
          {user && <Link to="/admin">Admin</Link>}
        </nav>

        <div className="nav-auth">
          {user ? (
            <>
              <span className="user-email">{user.email}</span>
              <button className="btn ghost" onClick={signOut}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}