import config from "../config/config"
import {UserInfoType} from "../types/user-info.type";
import {RefreshResponseType} from "../types/refresh-response.type";
import {LogoutResponseType} from "../types/logout-response.type";

export class Auth {
  // Статические переменные для хранения названия ключей
  public static accessTokenKey: string = "accessToken"
  private static refreshTokenKey: string = "refreshToken"
  private static userInfoKey: string = "userInfo"

  // Метод обновления refreshToken
  public static async processUnauthorizedResponse(): Promise<boolean> {
    const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey)
    if (refreshToken) {
      const response: Response = await fetch(config.host + "/refresh", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({refreshToken: refreshToken})
      })

      if (response && response.status === 200) {
        const result: RefreshResponseType | null = await response.json()
        if (result && !result.error && result.accessToken && result.refreshToken) {
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
  public static async logout(): Promise<boolean> {
    const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey)
    if (refreshToken) {
      const response: Response = await fetch(config.host + "/logout", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({refreshToken: refreshToken})
      })

      if (response && response.status === 200) {
        const result: LogoutResponseType | null = await response.json()
        if (result && !result.error) {
          Auth.removeTokens()
          localStorage.removeItem(this.userInfoKey)
          return true
        }
      }
    }
    return false
  }


  // Метод записи токенов в локальное хранилище
  public static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken)
    localStorage.setItem(this.refreshTokenKey, refreshToken)
  }

  // Метод удаления токенов с локального хранилища
  private static removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey)
    localStorage.removeItem(this.refreshTokenKey)
  }

  // Метод записи информации о пользователе в локальное хранилище
  public static setUserInfo(info: UserInfoType): void {
    localStorage.setItem(this.userInfoKey, JSON.stringify(info))
  }

  // Метод получения информации о пользователе с локального хранилища
  public static getUserInfo(): UserInfoType | null {
    let userInfo: string | null = localStorage.getItem(this.userInfoKey)

    if (userInfo) {
      return JSON.parse(userInfo)
    }
    return null
  }
}