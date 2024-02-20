import { StoreManager } from "../utils/store-manager.js"

export class Result {
  constructor() {
    new StoreManager().checkUserData()

    const resultQuiz = sessionStorage.getItem("result-response")
    const resultQuizPars = JSON.parse(resultQuiz)

    resultQuizPars.forEach(item => {
      document.getElementById("result-score").innerText =
        item.score + "/" + item.total
    })

    document.getElementById("result-value").onclick = function() {
      location.href = "#/resultValue"
    }
  }
}
