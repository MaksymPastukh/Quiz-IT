import {StoreManager} from "../utils/store-manager"
import {CustomHttp} from "../services/castom-http"
import config from "../config/config"
import {Auth} from "../services/auth"
import {QueryParamsType} from "../types/query-params.type";
import {UserInfoType} from "../types/user-info.type";
import {PassTestResponseType} from "../types/pass-test-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class Result {
  private routeParams: QueryParamsType

  constructor() {
    this.routeParams = StoreManager.getQueryParams()
    this.init()
  }

  private async init(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!userInfo) {
      location.href = "#/"
      return
    }

    if (this.routeParams.id) {
      try {
        const result: DefaultResponseType | PassTestResponseType = await CustomHttp.request(config.host + "/tests/" + this.routeParams.id + "/result?userId=" + userInfo.userId)

        if (result) {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message)
          }

          const resultScoreElement: HTMLElement | null = document.getElementById("result-score")
          if (resultScoreElement) resultScoreElement.innerText = (result as PassTestResponseType).score + "/" + (result as PassTestResponseType).total
          const resultValueElement: HTMLElement | null = document.getElementById("result-value")
          if (resultValueElement) {
            resultValueElement.addEventListener("click", (e) => {
              e.preventDefault()
              location.href = "#/resultValue?id=" + this.routeParams.id
            })
          }

          return
        }
      } catch (e) {
        console.log(e)
      }
    }

    location.href = "#/"
  }
}
