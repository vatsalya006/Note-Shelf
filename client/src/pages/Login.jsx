import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("rahul@example.com");
    const [password, setPassword] = useState("secondbrain");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error);

            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="signin-screen">
            <div className="signin-card">

                <div className="signin-brand">
                    <div className="logo">NS</div>

                    <div>
                        <strong>Note Shelf</strong>
                        <span>Your AI knowledge workspace</span>
                    </div>
                </div>

                <div className="signin-heading">
                    <span className="signin-label">WELCOME BACK</span>

                    <h1>Sign in to Note Shelf</h1>

                    <p>
                        Access your notes, documents, videos, and connected knowledge
                        from one intelligent workspace.
                    </p>
                </div>

                <form className="form" onSubmit={handleSubmit}>

                    <label className="field">
                        Email

                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                    </label>

                    <label className="field">
                        Password

                        <div className="password-field">

                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>

                        </div>
                    </label>

                    <div className="signin-options">

                        <label className="remember">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>

                        <button
                            type="button"
                            className="forgot-password"
                        >
                            Forgot password?
                        </button>

                    </div>
                    {error && (
                        <p className="form-error">
                            {error}
                        </p>
                    )}
                    <button
                        className="primary signin-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                </form>

                <div className="signin-footer">

                    <button
                        className="text-button"
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        ← Back home
                    </button>

                    <span>Demo mode • No account required</span>

                </div>

            </div>
        </section>
    );
}

export default Login;