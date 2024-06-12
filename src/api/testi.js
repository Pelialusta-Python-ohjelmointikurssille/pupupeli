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