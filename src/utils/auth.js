class Auth {
    constructor({ baseUrl, headers }) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    register( email,password ) {
        return fetch(`${this._baseUrl}/signup`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                password: password,
                email: email
            })
        })
            .then((res) => res.ok ? res.json() : Promise.reject(`${res.status} ${res.statusText}`));
    }

    login( email, password ) {
        return fetch(`${this._baseUrl}/signin`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                password: password,
                email: email
            })
        })
            .then((res) => res.ok ? res.json() : Promise.reject(`${res.status} ${res.statusText}`));
    }

    getToken() {
        const jwt = localStorage.getItem('jwt');
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                ...this._headers,
                "Authorization": `Bearer ${jwt}`
            }
        })
            .then(res => res.ok ? res.json() : Promise.reject(`${res.status} ${res.statusText}`));
    }
}

const auth = new Auth({
    baseUrl: 'https://auth.nomoreparties.co',
    headers: {
        "Content-Type": "application/json"
    }
})

export default auth;