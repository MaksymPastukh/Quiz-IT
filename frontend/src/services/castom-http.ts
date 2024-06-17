import {Auth} from "./auth"

export class CustomHttp {
  public static async request(url: string, method: string = "GET", body: any = null): Promise<any> {
    const params: any = {
      method: method,
      headers: {
        "Content-type": "application/json",
        "Accept": "application/json"
      }
    }

    let token: string | null = localStorage.getItem(Auth.accessTokenKey)

    if (token) {
      params.headers["x-access-token"] = token
    }

    // Если body пришло в функцию
    if (body) {
      // То мы params.body добавляем то что пришло
      params.body = JSON.stringify(body)
    }

    const response: Response = await fetch(url, params)

    if (response.status < 200 || response.status >= 300) {
      // Делаем проверку на код 401
      // если получим эту ошибку то accessToken истек срок. Будем его обновлять
      if (response.status === 401) {
        let result : boolean = await Auth.processUnauthorizedResponse()

        if (result) {
          return await this.request(url, method, body)
        } else {
          return null
        }

      }
      throw new Error(response.statusText)
    }

    return await response.json()
  }
}