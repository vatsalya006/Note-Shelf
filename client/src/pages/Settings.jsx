import { useTheme } from "../context/ThemeContext";

function Settings() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="settings-page">

            <div className="settings-header">
                <h1>Settings</h1>
                <p>Manage your Note Shelf preferences.</p>
            </div>

            <section className="settings-section">

                <div className="settings-section-heading">
                    <h2>Appearance</h2>
                    <p>Customize how Note Shelf looks on your device.</p>
                </div>

                <div className="theme-setting">
                    <div className="theme-setting-info">
                        <h3>Theme</h3>
                        <p>Choose your preferred appearance.</p>
                    </div>

                    <div className="theme-options">

                        <button
                            className={`theme-option ${theme === "dark" ? "active" : ""}`}
                            onClick={() => setTheme("dark")}
                        >
                            <span className="theme-preview dark-preview">
                                🌙
                            </span>
                            <span>Dark</span>
                            {theme === "dark" && <span>✓</span>}
                        </button>

                        <button
                            className={`theme-option ${theme === "light" ? "active" : ""}`}
                            onClick={() => setTheme("light")}
                        >
                            <span className="theme-preview light-preview">
                                ☀️
                            </span>
                            <span>Light</span>
                            {theme === "light" && <span>✓</span>}
                        </button>

                    </div>
                </div>

            </section>

        </div>
    );
}

export default Settings;