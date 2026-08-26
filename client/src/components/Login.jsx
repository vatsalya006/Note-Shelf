import { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        setIsLoggedIn(true);
    };

    return (
        <div className="login-container">
            {isLoggedIn ? (
                <h1>Welcome to Note Shelf!</h1>
            ) : (
                <>
                    <h1>Welcome Back</h1>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />

                        <button type="submit">
                            Login
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

export default Login;