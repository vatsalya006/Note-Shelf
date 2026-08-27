import { useState } from "react";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            console.log("Register response:", data);

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Account created successfully!");

            console.log("Registered user:", data.user);

        } catch (error) {
            console.error("Registration error:", error);
            alert("Something went wrong. Please try again.");
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
                    <span className="signin-label">GET STARTED</span>

                    <h1>Create your account</h1>

                    <p>
                        Create your Note Shelf account and start building
                        your personal knowledge workspace.
                    </p>
                </div>

                <form className="form" onSubmit={handleSubmit}>

                    <label className="field">
                        Name

                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Your name"
                            autoComplete="name"
                            required
                        />
                    </label>

                    <label className="field">
                        Email

                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />
                    </label>

                    <label className="field">
                        Password

                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Create a password"
                            autoComplete="new-password"
                            required
                        />
                    </label>

                    <button
                        className="primary signin-button"
                        type="submit"
                    >
                        Create account
                    </button>

                </form>

            </div>
        </section>
    );
}

export default Register;