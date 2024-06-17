import {StoreManager} from "../utils/store-manager"
import {CustomHttp} from "../services/castom-http"
import config from "../config/config"
import {Auth} from "../services/auth"
import {QueryParamsType} from "../types/query-params.type";
import {QuizAnswerType, QuizQuestionType, QuizType} from "../types/quiz.type";
import {UserResultType} from "../types/user-result.type";
import {DefaultResponseType} from "../types/default-response.type";
import {ActionTestType} from "../types/action-test.type";
import {UserInfoType} from "../types/user-info.type";
import {PassTestResponseType} from "../types/pass-test-response.type";

export class Test {
  private progressBarElement: HTMLElement | null = null
  private nextButtonElement: HTMLElement | null = null
  private passButtonElement: HTMLElement | null = null
  private prevButtonElement: HTMLElement | null = null
  private questionTitleElement: HTMLElement | null = null
  private optionsElement: HTMLElement | null = null
  private quiz: QuizType | null = null
  private currentQuestionIndex: number
  readonly userResult: UserResultType[]
  readonly KEY_RESULT_QUIZ: string
  readonly KEY_RESULT_RESPONSE: string
  readonly routeParams: QueryParamsType
  private interval: number = 0


  constructor() {
    this.currentQuestionIndex = 1
    this.userResult = []
    this.KEY_RESULT_QUIZ = "result-quiz"
    this.KEY_RESULT_RESPONSE = "result-response"
    this.routeParams = StoreManager.getQueryParams()
    this.init()
  }

  private async init(): Promise<void> {
    if (this.routeParams.id) {
      try {
        const result: DefaultResponseType | QuizType = await CustomHttp.request(config.host + "/tests/" + this.routeParams.id)
        if (result) {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message)
          }

          this.quiz = result as QuizType
          console.log(this.quiz)
          this.startQuiz()
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  private startQuiz(): void {
    if (!this.quiz) return
    this.progressBarElement = document.getElementById("progress-bar")
    this.questionTitleElement = document.getElementById("title")
    this.optionsElement = document.getElementById("options")

    // Далее
    this.nextButtonElement = document.getElementById("next")
    if (this.nextButtonElement) {
      this.nextButtonElement.onclick = this.move.bind(this, ActionTestType.next)

    }
    // Пропустить
    this.passButtonElement = document.getElementById("pass")
    if (this.passButtonElement) {
      this.passButtonElement.onclick = this.move.bind(this, ActionTestType.pass)
    }
    const preTitleElement: HTMLElement | null = document.getElementById("pre-title")
    if (preTitleElement) {
      preTitleElement.innerText = this.quiz.name
    }
    // Назад
    this.prevButtonElement = document.getElementById("prev")
    if (this.prevButtonElement) {
      this.prevButtonElement.onclick = this.move.bind(this, ActionTestType.prev)
    }

    // Отображаем вопрос и варианты ответа
    this.prepareProgressBar()
    this.showQuestion()

    // Таймер теста
    const timerElement: HTMLElement | null = document.getElementById("timer")
    let seconds = 159
    const that: Test = this
    this.interval = window.setInterval(
      function () {
        seconds--
        if (timerElement) timerElement.innerText = seconds.toString()
        if (seconds === 0) {
          clearInterval(that.interval)
          that.complete()
        }
      }.bind(this),
      1000
    )
  }


  private prepareProgressBar(): void {
    if (!this.quiz) return

    for (let i = 0; i < this.quiz.questions.length; i++) {
      const itemElement: HTMLElement | null = document.createElement("div")
      itemElement.className =
        "test-progress-bar-item " + (i === 0 ? "active" : "")

      const itemCircleElement: HTMLElement | null = document.createElement("div")
      itemCircleElement.className = "test-progress-bar-item-circle"

      const itemTextElement: HTMLElement | null = document.createElement("div")
      itemTextElement.className = "test-progress-bar-item-text"
      itemTextElement.innerText = `Вопрос ${i + 1}`

      itemElement.appendChild(itemCircleElement)
      itemElement.appendChild(itemTextElement)

      if (this.progressBarElement) this.progressBarElement.appendChild(itemElement)
    }
  }

  private showQuestion(): void {
    if (!this.quiz) return

    const activeQuestion: QuizQuestionType = this.quiz.questions[this.currentQuestionIndex - 1]

    if (this.questionTitleElement) {
      this.questionTitleElement.innerHTML = `
          <span>Вопрос ${this.currentQuestionIndex} - </span> 
          ${activeQuestion.question}
      `
    }

    if (this.optionsElement) {

      this.optionsElement.innerHTML = ""

    }

    const that: Test = this
    const chosenOption: UserResultType | undefined = this.userResult.find(
      (item: UserResultType): boolean => item.questionId === activeQuestion.id
    )

    that.choose()

    activeQuestion.answers.forEach((answer: QuizAnswerType): void => {
      const inputId: string = `answer-${answer.id}`

      const optionElement: HTMLElement | null = document.createElement("div")
      optionElement.className = "test-question-option"

      const inputElement: HTMLElement | null = document.createElement("input")
      inputElement.className = "option-answer"
      inputElement.setAttribute("id", inputId)
      inputElement.setAttribute("type", "radio")
      inputElement.setAttribute("name", "answer")
      inputElement.setAttribute("value", answer.id.toString())
      if (chosenOption && chosenOption.chosenAnswerId === answer.id) {
        inputElement.setAttribute("checked", "checked")
      }

      inputElement.onchange = function () {
        that.chooseAnswer()
      }

      const labelElement: HTMLElement | null = document.createElement("label")
      labelElement.setAttribute("for", inputId)
      labelElement.innerText = answer.answer

      optionElement.appendChild(inputElement)
      optionElement.appendChild(labelElement)

      if (this.optionsElement) this.optionsElement.appendChild(optionElement)
    })

    // Проверяем на то есть ли у нас ответ на вопрос
    // (Если ответ на вопрос есть тогда делаем кнопку доступной) иначе (кнопка заблокирована)
    if (this.nextButtonElement) {
      if (chosenOption && chosenOption.chosenAnswerId) {
        this.nextButtonElement.removeAttribute("disabled")
      } else {
        this.nextButtonElement.setAttribute("disabled", "disabled")
      }
    }


    // Проверка (Если последний вопрос то меняем значение кнопки Далее на Завершить) иначе (Возвращаем значение)
    if (this.nextButtonElement) {
      if (this.currentQuestionIndex === this.quiz.questions.length) {
        this.nextButtonElement.innerHTML = "Завершить"
      } else {
        this.nextButtonElement.innerHTML = "Далее"
      }
    }


    // Проверка (Если второй вопрос добавляем возможность работать с кнопкой "Назад") иначе (Кнопка заблокирована)

    if (this.prevButtonElement) {
      if (this.currentQuestionIndex > 1) {
        this.prevButtonElement.removeAttribute("disabled")
      } else {
        this.prevButtonElement.setAttribute("disabled", "disabled")
      }
    }

  }

  private chooseAnswer(): void {
    if (this.passButtonElement && this.nextButtonElement) {
      this.passButtonElement.classList.add("disabled")
      this.nextButtonElement.removeAttribute("disabled")
    }

  }

  private choose() {
    if (this.passButtonElement) this.passButtonElement.classList.remove("disabled")

  }

  private move(action: ActionTestType): void {
    if (!this.quiz) return

    // Получаем результаты теста и записываем в массив
    const activeQuestionId: QuizQuestionType =
      this.quiz.questions[this.currentQuestionIndex - 1]
    const chosenAnswer: HTMLInputElement | undefined = Array.from(
      document.getElementsByClassName("option-answer")
    ).find(el => {
      return (el as HTMLInputElement).checked
    }) as HTMLInputElement

    let chosenAnswerId: number | null = null
    if (chosenAnswer && chosenAnswer.value) {
      chosenAnswerId = Number(chosenAnswer.value)
    }

    // Проверяем есть ли уже в массиве обект для такого questionId
    const existingResult: UserResultType | undefined = this.userResult.find(item => {
      return item.questionId === activeQuestionId.id
    })

    if (chosenAnswerId) {
      if (existingResult) {
        existingResult.chosenAnswerId = chosenAnswerId
      } else {
        this.userResult.push({
          questionId: activeQuestionId.id,
          chosenAnswerId: chosenAnswerId
        })
      }
    }

    sessionStorage.setItem(
      this.KEY_RESULT_QUIZ,
      JSON.stringify(this.userResult)
    )

    // Пагинация
    if (action === ActionTestType.next || action === ActionTestType.pass) {
      this.currentQuestionIndex++
    } else {
      this.currentQuestionIndex--
    }

    if (this.currentQuestionIndex > this.quiz.questions.length) {
      clearInterval(this.interval)
      this.complete()
      return
    }

    if (this.progressBarElement) {
      Array.from(this.progressBarElement.children).forEach((item: Element, index: number): void => {
        const currentItemIndex: number = index + 1
        item.classList.remove("complete")
        item.classList.remove("active")

        if (currentItemIndex === this.currentQuestionIndex) {
          item.classList.add("active")
        } else if (currentItemIndex < this.currentQuestionIndex) {
          item.classList.add("complete")
        }
      })
    }

    this.showQuestion()
  }

 private async complete(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!userInfo) {
      location.href = "#/"
      return
    }

    try {
      const result: DefaultResponseType | PassTestResponseType = await CustomHttp.request(config.host + "/tests/" + this.routeParams.id + "/pass", "POST",
        {
          userId: userInfo.userId,
          results: this.userResult
        })

      if (result) {
        if ((result as DefaultResponseType).error !== undefined) {
          throw new Error((result as DefaultResponseType).message)
        }
        location.href = "#/result?id=" + this.routeParams.id
      }
    } catch (e) {
      console.log(e)
    }
  }
}
