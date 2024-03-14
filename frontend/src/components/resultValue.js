import { StoreManager } from "../utils/store-manager.js"
import { Auth } from "../services/auth.js"
import { CustomHttp } from "../services/castom-http.js"
import config from "../config/config.js"

export class ResultValue {
  constructor() {
    this.preTitle = null
    this.resTitle = null
    this.resOptions = null
    this.resUser = null
    this.resultDetailsTest = null
    const dataUsers = localStorage.getItem("userInfo")
    const dataPars = JSON.parse(dataUsers)
    this.localStorageFullName = dataPars.fullName
    this.localStorageEmail = dataPars.email

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
        const resultDetailsTest = await CustomHttp.request(config.host + "/tests/" + this.routeParams.id + "/result/details?userId=" + userInfo.userId)
        if (resultDetailsTest) {
          if (resultDetailsTest.error) {
            throw new Error(resultDetailsTest.error)
          }

          this.resultDetailsTest = resultDetailsTest.test
          this.resultQuiz()
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  resultQuiz() {
    this.preTitle = document.getElementById("pre-title")
    this.resTitle = document.getElementById("res-title")
    this.resOptions = document.getElementById("res-options")
    this.resUser = document.getElementById("user-name")

    this.showResultQuiz()
    this.resUser.innerText = `${this.localStorageFullName}, ${this.localStorageEmail}`
    document.getElementById("result-value").addEventListener("click", (e) => {
      e.preventDefault()
      location.href = "#/result?id=" + this.routeParams.id
    })
  }

  showResultQuiz() {
    this.preTitle.innerHTML = this.resultDetailsTest.name
    this.resultDetailsTest.questions.map((item, index) => {
      this.resTitle = document.createElement("div")
      this.resTitle.className = "result-question-title"
      this.resTitle.innerHTML = `
				<span>Вопрос ${index + 1} : </span> 
				${item.question}
		`
      this.resOptions.appendChild(this.resTitle)

      item.answers.forEach(item => {
        const inputId = `answer-${item.id}`
        const optionElement = document.createElement("div")
        optionElement.className = "result-question-option"
        const inputElement = document.createElement("input")
        inputElement.className = "option-answer"
        inputElement.setAttribute("id", inputId)
        inputElement.setAttribute("type", "radio")
        inputElement.setAttribute("name", "answer")
        inputElement.setAttribute("value", item.id)

        const labelElement = document.createElement("label")
        labelElement.setAttribute("for", inputId)
        labelElement.innerText = item.answer
        if (item.correct === true) {
          labelElement.className = "result-success"
          inputElement.className = "result-input-success"
        } else if (item.correct === false) {
          labelElement.className = "result-error"
          inputElement.className = "result-input-error"
        }

        optionElement.appendChild(inputElement)
        optionElement.appendChild(labelElement)
        this.resOptions.appendChild(optionElement)
      })
    })
  }
}
