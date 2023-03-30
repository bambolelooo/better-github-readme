const decode = require('jwt-decode')

class AuthService {
    login() {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        if (token) {
            localStorage.setItem('user', token)
        }
    }

    logout() {
        localStorage.removeItem('user')
        window.location.assign('/')
    }

    getToken() {
        return localStorage.getItem('user')
    }

    loggedIn() {
        const token = this.getToken()
        return token ? true : false
    }

    getAccessToken() {
        return decode(this.getToken())
    }
}

export default new AuthService()
