export class AuthService {
    static tokenFieldName = 'token'

    static saveToken(token: string) {
        localStorage.setItem(this.tokenFieldName, token);
    }

    static getToken() {
        return localStorage.getItem(this.tokenFieldName)
    }

    static removeToken() {
        return localStorage.removeItem(this.tokenFieldName)
    }
}