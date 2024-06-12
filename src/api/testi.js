async function getCompletedTasks(token) {
    const response = await fetch(`https://tie.koodariksi.fi/api/list?token=${token}`, {
        method: 'GET'
    });

    if (response.ok) {
        const data = await response.json();
        return data.completedTasks;
    } else {
        throw new Error('Failed to retrieve completed tasks');
    }
}
async function login(username, password) {
    const response = await fetch('https://tie.koodariksi.fi/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        const token = data.token;

        localStorage.setItem('authToken', token);

        return token;
    } else {
        throw new Error('Login failed');
    }
}


