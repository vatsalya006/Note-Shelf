import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const workspaceItems = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: "⌂",
        },
        {
            label: "Notes",
            path: "/notes",
            icon: "▤",
        },
        {
            label: "Upload",
            path: "/upload",
            icon: "↥",
        },
    ];

    const intelligenceItems = [
        {
            label: "AI Search",
            path: "/ai-search",
            icon: "⌕",
        },
        {
            label: "Graph",
            path: "/graph",
            icon: "◎",
        },
        {
            label: "AI Chat",
            path: "/ai-chat",
            icon: "✦",
        },
    ];

    let storedUser = {};
    try {
        storedUser = JSON.parse(localStorage.getItem("user")) || {};
    } catch {
        storedUser = {};
    }
    const displayName = storedUser.name || "Rahul";

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <aside className="sidebar">

            {/* Brand */}
            <div className="brand">
                <div className="logo">NS</div>

                <div>
                    <strong>Note Shelf</strong>
                    <span>Knowledge Graph</span>
                </div>
            </div>

            {/* Workspace */}
            <div className="nav-label">
                Workspace
            </div>

            <nav className="nav">
                {workspaceItems.map((item) => (
                    <button
                        key={item.path}
                        className={location.pathname === item.path ? "active" : ""}
                        onClick={() => handleNavigation(item.path)}
                    >
                        <span className="ico">
                            {item.icon}
                        </span>

                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Intelligence */}
            <div className="nav-label">
                Intelligence
            </div>

            <nav className="nav">
                {intelligenceItems.map((item) => (
                    <button
                        key={item.path}
                        className={location.pathname === item.path ? "active" : ""}
                        onClick={() => handleNavigation(item.path)}
                    >
                        <span className="ico">
                            {item.icon}
                        </span>

                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Profile */}
            <div className="profile">

                <div className="avatar">
                    {displayName.charAt(0).toUpperCase()}
                </div>

                <div>
                    <strong>{displayName}</strong>
                    <span>Free plan</span>
                </div>

                <button
                    className={`gear ${location.pathname === "/settings" ? "active" : ""}`}
                    type="button"
                    aria-label="Settings"
                    title="Settings"
                    onClick={() => handleNavigation("/settings")}
                >
                    ⚙
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;