import {StoreManager} from "../utils/store-manager"
import {Auth} from "../services/auth"
import {CustomHttp} from "../services/castom-http"
import config from "../config/config"
import {QueryParamsType} from "../types/query-params.type";
import {UserInfoType} from "../types/user-info.type";
import {DefaultResponseType} from "../types/default-response.type";
import {ResultQuestionType, ResultValueType} from "../types/result-value.type";
import {QuizAnswerType} from "../types/quiz.type";

export class ResultValue {
  private preTitle: HTMLElement | null = null
  private resTitle: HTMLElement | null = null
  private resOptions: HTMLElement | null = null
  private resUser: HTMLElement | null = null
  private resultDetailsTest: ResultValueType | null = null
  readonly dataUsers: string | null
  readonly dataPars: any
  readonly localStorageFullName: string | undefined
  readonly localStorageEmail: string | undefined
  readonly routeParams: QueryParamsType

  constructor() {
    this.dataUsers = localStorage.getItem("userInfo")
    this.dataPars = JSON.parse(<any>this.dataUsers)
    if (this.dataPars) {
      this.localStorageFullName = this.dataPars.fullName
      this.localStorageEmail = this.dataPars.email
    }

    this.routeParams = StoreManager.getQueryParams()
    this.init()

  }

  private async init(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!userInfo) {
      location.href = "#/"
      return
    }

    if (userInfo) {
      try {
        const resultTest: ResultValueType | DefaultResponseType = await CustomHttp.request(config.host + "/tests/" + this.routeParams.id + "/result/details?userId=" + userInfo.userId)
        if (resultTest) {
          if ((resultTest as DefaultResponseType).error !== undefined) {
            throw new Error((resultTest as DefaultResponseType).message)
          }
          this.resultDetailsTest = resultTest as ResultValueType

          this.resultQuiz()
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  resultQuiz(): void {
    this.preTitle = document.getElementById("pre-title")
    this.resTitle = document.getElementById("res-title")
    this.resOptions = document.getElementById("res-options")
    this.resUser = document.getElementById("user-name")

    this.showResultQuiz()
    if (this.resUser) this.resUser.innerText = `${this.localStorageFullName}, ${this.localStorageEmail}`

    const buttonBackResult: HTMLElement | null = document.getElementById("result-value")
    if (buttonBackResult) {
      buttonBackResult.addEventListener("click", (e) => {
        e.preventDefault()
        location.href = "#/result?id=" + this.routeParams.id
      })
    }

  }

  showResultQuiz(): void {
    if (!this.resultDetailsTest) return

    console.log(this.resultDetailsTest.test.name)
    if (this.preTitle) this.preTitle.innerHTML = this.resultDetailsTest.test.name

    this.resultDetailsTest.test.questions.map((item: ResultQuestionType, index: number): void => {
      this.resTitle = document.createElement("div")
      this.resTitle.className = "result-question-title"
      this.resTitle.innerHTML = `
				<span>Вопрос ${index + 1} : </span> 
				${item.question}
		`
      if (this.resOptions) this.resOptions.appendChild(this.resTitle)

      item.answers.forEach((item: QuizAnswerType): void => {
        const inputId: string = `answer-${item.id}`
        const optionElement: HTMLDivElement = document.createElement("div")
        optionElement.className = "result-question-option"
        const inputElement: HTMLInputElement = document.createElement("input")
        inputElement.className = "option-answer"
        inputElement.setAttribute("id", inputId)
        inputElement.setAttribute("type", "radio")
        inputElement.setAttribute("name", "answer")
        inputElement.setAttribute("value", item.id.toString())

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
        if (this.resOptions) this.resOptions.appendChild(optionElement)
      })
    })
  }
}
