export async function sendPostRequest(url, payload) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            if(response.status === 400) {
                return { type: 'error', message: 'User already exists' };
            }

            if (response.status === 401) {
                return { type: 'error', message: 'Incorrect username or password.' };
            } else if (response.status === 500) {
                return { type: 'error', message: 'Server error. Please try again later.' };
            } else {
                return { type: 'error', message: `Unexpected error: ${response.status}` };
            }
        }

        const data = await response.json();
        return { type: 'success', message: 'Login successful.', token: data.token };
    } catch (error) {
        return { type: 'error', message: 'Network error. Please try again.' };
    }
}
