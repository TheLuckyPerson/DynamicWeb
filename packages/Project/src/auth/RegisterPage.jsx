import { useNavigate } from 'react-router-dom';
import { UsernamePasswordForm } from './UsernamePasswordForm.jsx';
import { sendPostRequest } from './sendPostRequest';

export function RegisterPage() {
    const navigate = useNavigate(); 

    const handleRegister = async (formData) => {
        const username = formData.get("username");
        const password = formData.get("password");

        console.log("Register Username:", username);
        console.log("Register Password:", password);

        const payload = { username, password };
        const result = await sendPostRequest('/auth/register', payload);

        if (result.type === 'success') {
            navigate('/login'); 
        } else {
            
            alert(result.message); 
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen p-4">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Register</h1>
                <UsernamePasswordForm onSubmit={handleRegister} />
            </div>
        </div>
    );
}
