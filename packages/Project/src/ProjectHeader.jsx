import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ProjectHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem("dark-mode") === "true"
    );
    const location = useLocation();
    const [route, setRoute] = useState(location.pathname);

    useEffect(() => {
        document.body.classList.toggle("dark-mode", isDarkMode);
        localStorage.setItem("dark-mode", isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        setIsMenuOpen(false); 
        setRoute(location.pathname);
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