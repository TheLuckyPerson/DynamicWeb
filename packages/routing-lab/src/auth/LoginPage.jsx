import { UsernamePasswordForm } from './UsernamePasswordForm.jsx';
import { sendPostRequest } from './sendPostRequest';
import { Link, useNavigate } from "react-router-dom";

export function LoginPage({ setAuthToken }) {
    const navigate = useNavigate(); 

    const handleLogin = async (formData) => {
        const username = formData.get("username");
        const password = formData.get("password");

        console.log("Login Username:", username);
        console.log("Login Password:", password);

        const payload = { username, password };
        
        const submitResult = await sendPostRequest('/auth/login', payload);

        if (submitResult.type === 'error') {
            return submitResult; 
        }

        const { token } = submitResult;
        console.log("Authentication Token:", token);

        setAuthToken(token); 

        localStorage.setItem("authToken", token);

        navigate('/'); 
        return { type: 'success', message: 'Login successful.' };
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <UsernamePasswordForm onSubmit={handleLogin} />
            <p className="mt-4">
                Don't have an account? <Link to="/register" className="text-blue-500">Register here</Link>
            </p>
        </div>
    );
}
