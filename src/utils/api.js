class Api {
    constructor({ baseUrl, headers }) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    getInitialCards() {
        return fetch(`${this._baseUrl}/cards`, { headers: this._headers }).then(
            this._checkRequestResult,
        );
    }

    getUserInfo() {
        return fetch(`${this._baseUrl}/users/me`, { headers: this._headers }).then(
            this._checkRequestResult,
        );
    }

    _checkRequestResult(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Возникла ошибка: ${res.status}`);
    }

    setUserInfo(info) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify(info),
        }).then(this._checkRequestResult);
    }

    setAvatar(avatar) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify(avatar),
        }).then(this._checkRequestResult);
    }

    postNewCard({ name, link }) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                name: name,
                link: link,
            }),
        }).then(this._checkRequestResult);
    }

    likeCard(cardId, isLiked) {
        return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
            method: !isLiked ? 'DELETE' : 'PUT',
            headers: this._headers,
        }).then(this._checkRequestResult);
    }

    deleteCard(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}`, {
            method: 'DELETE',
            headers: this._headers,
        }).then(this._checkRequestResult);
    }
}

const api = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-24',
    headers: {
        authorization: 'c1450c2c-a48c-4f63-ab99-b9b5f6aeb0cf',
        'Content-Type': 'application/json',
    },
});
export default api; 