import { StoreManager } from "../utils/store-manager.js"
import { CustomHttp } from "../services/castom-http.js"
import config from "../config/config.js"
import { Auth } from "../services/auth.js"

export class Test {
  constructor() {
    this.progressBarElement = null
    this.nextButtonElement = null
    this.passButtonElement = null
    this.prevButtonElement = null
    this.questionTitleElement = null
    this.optionsElement = null
    this.quiz = null
    this.currentQuestionIndex = 1
    this.userResult = []
    this.KEY_RESULT_QUIZ = "result-quiz"
    this.KEY_RESULT_RESPONSE = "result-response"
    this.routeParams = StoreManager.getQueryParams()
    this.init()
  }

  async init() {
    if (this.routeParams.id) {
      try {
        const result = await CustomHttp.request(config.host + "/tests/" + this.routeParams.id)
        // console.log(result)
        if (result) {
          if (result.error) {
            throw new Error(result.error)
          }

          this.quiz = result
          this.startQuiz()
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  startQuiz() {
    this.progressBarElement = document.getElementById("progress-bar")
    this.questionTitleElement = document.getElementById("title")
    this.optionsElement = document.getElementById("options")

    // Далее
    this.nextButtonElement = document.getElementById("next")
    this.nextButtonElement.onclick = this.move.bind(this, "next")
    // Пропустить
    this.passButtonElement = document.getElementById("pass")
    this.passButtonElement.onclick = this.move.bind(this, "pass")
    document.getElementById("pre-title").innerText = this.quiz.name
    // Назад
    this.prevButtonElement = document.getElementById("prev")
    this.prevButtonElement.onclick = this.move.bind(this, "prev")

    // Отображаем вопрос и варианты ответа
    this.prepareProgressBar()
    this.showQuestion()

    // Таймер теста
    const timerElement = document.getElementById("timer")
    let seconds = 159
    this.interval = setInterval(
      function() {
        seconds--
        timerElement.innerText = seconds
        if (seconds === 0) {
          clearInterval(this.interval)
          this.complete()
        }
      }.bind(this),
      1000
    )
  }


  prepareProgressBar() {
    for (let i = 0; i < this.quiz.questions.length; i++) {
      const itemElement = document.createElement("div")
      itemElement.className =
        "test-progress-bar-item " + (i === 0 ? "active" : "")

      const itemCircleElement = document.createElement("div")
      itemCircleElement.className = "test-progress-bar-item-circle"

      const itemTextElement = document.createElement("div")
      itemTextElement.className = "test-progress-bar-item-text"
      itemTextElement.innerText = `Вопрос ${i + 1}`

      itemElement.appendChild(itemCircleElement)
      itemElement.appendChild(itemTextElement)

      this.progressBarElement.appendChild(itemElement)
    }
  }

  showQuestion() {
    const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1]

    // console.log(activeQuestion.question)
    this.questionTitleElement.innerHTML = `
          <span>Вопрос ${this.currentQuestionIndex} - </span> 
          ${activeQuestion.question}
      `

    this.optionsElement.innerHTML = ""
    const that = this
    const chosenOption = this.userResult.find(
      item => item.questionId === activeQuestion.id
    )

    that.choose()

    activeQuestion.answers.forEach(answer => {
      const inputId = `answer-${answer.id}`

      const optionElement = document.createElement("div")
      optionElement.className = "test-question-option"

      const inputElement = document.createElement("input")
      inputElement.className = "option-answer"
      inputElement.setAttribute("id", inputId)
      inputElement.setAttribute("type", "radio")
      inputElement.setAttribute("name", "answer")
      inputElement.setAttribute("value", answer.id)
      if (chosenOption && chosenOption.chosenAnswerId === answer.id) {
        inputElement.setAttribute("checked", "checked")
      }

      inputElement.onchange = function() {
        that.chooseAnswer()
      }

      const labelElement = document.createElement("label")
      labelElement.setAttribute("for", inputId)
      labelElement.innerText = answer.answer

      optionElement.appendChild(inputElement)
      optionElement.appendChild(labelElement)

      this.optionsElement.appendChild(optionElement)
    })

    // Проверяем на то есть ли у нас ответ на вопрос
    // (Если ответ на вопрос есть тогда делаем кнопку доступной) иначе (кнопка заблокирована)
    if (chosenOption && chosenOption.chosenAnswerId) {
      this.nextButtonElement.removeAttribute("disabled")
    } else {
      this.nextButtonElement.setAttribute("disabled", "disabled")
    }

    // Проверка (Если последний вопрос то меняем значение кнопки Далее на Завершить) иначе (Возвращаем значение)
    if (this.currentQuestionIndex === this.quiz.questions.length) {
      this.nextButtonElement.innerHTML = "Завершить"
    } else {
      this.nextButtonElement.innerHTML = "Далее"
    }

    // Проверка (Если второй вопрос добавляем возможность работать с кнопкой "Назад") иначе (Кнопка заблокирована)
    if (this.currentQuestionIndex > 1) {
      this.prevButtonElement.removeAttribute("disabled")
    } else {
      this.prevButtonElement.setAttribute("disabled", "disabled")
    }
  }

  chooseAnswer() {
    this.passButtonElement.classList.add("disabled")
    this.nextButtonElement.removeAttribute("disabled")
  }

  choose() {
    this.passButtonElement.classList.remove("disabled")
  }

  move(action) {
    // Получаем результаты теста и записываем в массив
    const activeQuestionId =
      this.quiz.questions[this.currentQuestionIndex - 1]
    const chosenAnswer = Array.from(
      document.getElementsByClassName("option-answer")
    ).find(el => {
      return el.checked
    })

    let chosenAnswerId = null
    if (chosenAnswer && chosenAnswer.value) {
      chosenAnswerId = Number(chosenAnswer.value)
    }

    // Проверяем есть ли уже в массиве обект для такого questionId
    const existingResult = this.userResult.find(item => {
      return item.questionId === activeQuestionId.id
    })

    if (existingResult) {
      existingResult.chosenAnswerId = chosenAnswerId
    } else {
      this.userResult.push({
        questionId: activeQuestionId.id,
        chosenAnswerId: chosenAnswerId
      })
    }

    sessionStorage.setItem(
      this.KEY_RESULT_QUIZ,
      JSON.stringify(this.userResult)
    )

    // Пагинация
    if (action === "next" || action === "pass") {
      this.currentQuestionIndex++
    } else {
      this.currentQuestionIndex--
    }

    if (this.currentQuestionIndex > this.quiz.questions.length) {
      clearInterval(this.interval)
      this.complete()
      return
    }

    Array.from(this.progressBarElement.children).forEach((item, index) => {
      const currentItemIndex = index + 1
      item.classList.remove("complete")
      item.classList.remove("active")

      if (currentItemIndex === this.currentQuestionIndex) {
        item.classList.add("active")
      } else if (currentItemIndex < this.currentQuestionIndex) {
        item.classList.add("complete")
      }
    })

    this.showQuestion()
  }

  async complete() {
    const userInfo = Auth.getUserInfo()
    if (!userInfo) {
      location.href = "#/"
    }

    try {
      const result = await CustomHttp.request(config.host + "/tests/" + this.routeParams.id + "/pass", "POST",
        {
          userId: userInfo.userId,
          results: this.userResult
        })

      if (result) {
        if (result.error) {
          throw new Error(result.error)
        }

        console.log(result)
        location.href = "#/result?id=" + this.routeParams.id
      }
    } catch (e) {
      console.log(e)
    }


  }
}