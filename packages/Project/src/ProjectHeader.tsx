import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ProjectHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(
        JSON.parse(localStorage.getItem("dark-mode") || "false")
    );
    const location = useLocation();

    useEffect(() => {
        document.body.classList.toggle("dark-mode", isDarkMode);
        localStorage.setItem("dark-mode", isDarkMode.toString());
    }, [isDarkMode]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    return (
        <header>
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
                </ul>
            </h1>
        </header>
    );
};

export default ProjectHeader;
