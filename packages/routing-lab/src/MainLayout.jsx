import { Header } from "./Header.jsx";
import { Outlet } from "react-router-dom";

export function MainLayout(props) {
    return (
        <div>
            <Header />
            <div style={{padding: "0 2em"}}>
                <Outlet />
            </div>
        </div>
    );
}
