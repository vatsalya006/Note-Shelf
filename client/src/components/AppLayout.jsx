import Sidebar from "./Sidebar";

function AppLayout({ children }) {
    return (
        <div className="app">
            <Sidebar />

            <main className="main">
                {children}
            </main>
        </div>
    );
}

export default AppLayout;