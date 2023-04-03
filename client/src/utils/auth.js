import jwt_decode from 'jwt-decode'
class AuthService {
    login() {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        if (token) {
            localStorage.setItem('user', token)
            window.location.assign('/repo')
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
        return !!token && !this.isTokenExpired(token)
    }

    getAccessToken() {
        const decoded = jwt_decode(this.getToken())
        return decoded.user.accessToken
    }

    isTokenExpired() {
        const decoded = jwt_decode(this.getToken())
        if (decoded.exp < Date.now() / 1000) {
            localStorage.removeItem('user')
            return true
        }
        return false
    }
}

export default new AuthService()
