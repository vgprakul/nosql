import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    const { error } = await signIn(email, password);

    setLoading(false);

    if (error) alert(error.message);
    else navigate("/");
  }

  async function handleSignup() {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const { error } = await signUp(email, password);

    if (error) alert(error.message);
    else alert("Signup successful. Check your email if confirmation is enabled.");
  }

  return (
    <section className="container section auth-page">
      <h2>Login / Sign up</h2>

      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="auth-actions">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <button type="button" className="btn ghost" onClick={handleSignup}>
            Sign up
          </button>
        </div>
      </form>
    </section>
  );
}
console.log(import.meta.env.VITE_SUPABASE_URL);