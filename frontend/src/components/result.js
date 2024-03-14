import { StoreManager } from "../utils/store-manager.js"
import { CustomHttp } from "../services/castom-http"
import config from "../config/config"
import { Auth } from "../services/auth"

export class Result {
  constructor() {
    this.routeParams = StoreManager.getQueryParams()
    this.init()
  }

  async init() {
    const userInfo = Auth.getUserInfo()
    if (!userInfo) {
      location.href = "#/"
    }

    if (this.routeParams.id) {
      try {
        const result = await CustomHttp.request(config.host + "/tests/" + this.routeParams.id + "/result?userId=" + userInfo.userId)
        if (result) {
          if (result.error) {
            throw new Error(result.error)
          }
          console.log(result)

          document.getElementById("result-score").innerText = result.score + "/" + result.total
          document.getElementById("result-value").addEventListener("click", (e) => {
            e.preventDefault()
            location.href = "#/resultValue?id=" + this.routeParams.id
          })
          return
        }
      } catch (e) {
        console.log(e)
      }
    }

    location.href = "#/"
  }
}
