import config from "../config/config.js"

export class Auth {
  // Статические переменные для хранения названия ключей
  static accessTokenKey = "accessToken"
  static  refreshTokenKey = " refreshToken"
  static  userInfoKey = "userInfo"

  // Метод обновления refreshToken
  static async processUnauthorizedResponse() {
    const refreshToken = localStorage.getItem(this.refreshTokenKey)
    if (refreshToken) {
      const response = await fetch(config.host + "/refresh", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ refreshToken: refreshToken })
      })

      if (response && response.status === 200) {
        const result = await response.json()
        if (result && !result.error) {
          this.setTokens(result.accessToken, result.refreshToken)
          return true
        }
      }
    }

    this.removeTokens()
    location.href = "/#"
    return false
  }

  // Метод выхода с аккаунта
  static async logout () {
    const refreshToken = localStorage.getItem(this.refreshTokenKey)
    if (refreshToken) {
      const response = await fetch(config.host + "/logout", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ refreshToken: refreshToken })
      })

      if (response && response.status === 200) {
        const result = await response.json()
        if (result && !result.error) {
          Auth.removeTokens()
          localStorage.removeItem(Auth.userInfoKey)
          return true
        }
      }
    }
  }


  // Метод записи токенов в локальное хранилище
  static setTokens(accessToken, refreshToken) {
    localStorage.setItem(this.accessTokenKey, accessToken)
    localStorage.setItem(this.refreshTokenKey, refreshToken)
  }

  // Метод удаления токенов с локального хранилища
  static removeTokens() {
    localStorage.removeItem(this.accessTokenKey)
    localStorage.removeItem(this.refreshTokenKey)
  }

  // Метод записи информации о пользователе в локальное хранилище
  static setUserInfo(info) {
    localStorage.setItem(this.userInfoKey, JSON.stringify(info))
  }

  // Метод получения информации о пользователе с локального хранилища
  static getUserInfo() {
    let userInfo = localStorage.getItem(this.userInfoKey)

    if (userInfo) {
      return JSON.parse(userInfo)
    }

    return null
  }


}