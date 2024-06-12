// testi, ei tarkoitus käyttää

async function postData(url = '', data = {}) {
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    });
    return response.json();
}

const apiUrl = 'https://tie.koodariksi.fi/api/login';
const formData = {
    username: 'puputesti',
    password: 'porkkana'
};

postData(apiUrl, formData)
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    