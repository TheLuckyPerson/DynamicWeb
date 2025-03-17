import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface ProjectHeaderProps {
    authToken: string;
    setAuthToken: React.Dispatch<React.SetStateAction<string>>;
}

const ProjectHeader = ({ authToken, setAuthToken }: ProjectHeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(
        JSON.parse(localStorage.getItem("dark-mode") || "false")
    );
    const location = useLocation();

    const username = authToken ? JSON.parse(atob(authToken.split('.')[1])).username : null;

    const handleLogout = () => {
        setAuthToken("");
        localStorage.removeItem("authToken");
    };

    useEffect(() => {
        document.body.classList.toggle("dark-mode", isDarkMode);
        localStorage.setItem("dark-mode", isDarkMode.toString());
    }, [isDarkMode]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    return (
        <header className="relative">
            <div className="dark-mode-toggle">
                <label>
                    <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={() => setIsDarkMode(!isDarkMode)}
                        autoComplete="off"
                    />
                    Dark mode
                </label>
            </div>

            <h1>
                <button className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    ☰ Menu
                </button>
                <ul className={`navbar ${isMenuOpen ? "" : "hidden"}`}>
                    <li className="navItem">Instadice</li>
                    <li className={`navItem ${location.pathname === "/" ? "active" : ""}`}>
                        <Link to="/">Roll</Link>
                    </li>
                    <li className={`navItem ${location.pathname === "/about" ? "active" : ""}`}>
                        <Link to="/about">About</Link>
                    </li>
                    <div className="absolute top-4 right-4 flex flex-col items-center">
                        {authToken ? (
                            <>
                                <span className="text-lg font-bold mb-2">Hello, {username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 text-lg font-bold rounded"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login">
                                <button className="bg-blue-500 text-white px-12 py-4 text-lg font-bold rounded">
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>
                </ul>

            </h1>

        </header>
    );
};

export default ProjectHeader;
