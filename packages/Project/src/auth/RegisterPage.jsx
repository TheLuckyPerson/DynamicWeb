import { UsernamePasswordForm } from './UsernamePasswordForm.jsx';
import { sendPostRequest } from './sendPostRequest';

export function RegisterPage() {
    const handleRegister = async (formData) => {
        const username = formData.get("username");
        const password = formData.get("password");

        console.log("Register Username:", username);
        console.log("Register Password:", password);

        const payload = { username, password };
        const result = await sendPostRequest('/auth/register', payload);

        return result;
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Register a New Account</h1>
            <UsernamePasswordForm onSubmit={handleRegister} />
        </div>
    );
}
