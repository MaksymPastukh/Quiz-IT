import { StoreManager } from "../utils/store-manager.js"

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

    new StoreManager().checkUserData()
    const id = sessionStorage.getItem("id-quiz")
    const idPars = JSON.parse(id)
    if (idPars) {
      const xhr = new XMLHttpRequest()
      xhr.open("GET", "https://testologia.site/get-quiz?id=" + idPars, false)
      xhr.send()

      if (xhr.status === 200 && xhr.responseText) {
        try {
          this.quiz = JSON.parse(xhr.responseText)
        } catch (e) {
          location.href("#/")
        }
        this.startQuiz()
      } else {
        location.href("#/")
      }
    } else {
      location.href("#/")
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
    const interval = setInterval(
      function() {
        seconds--
        timerElement.innerText = seconds
        if (seconds === 0) {
          clearInterval(interval)
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

    console.log(activeQuestion.question)
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

  complete() {
    const dataUsers = sessionStorage.getItem("clients")
    const dataPars = JSON.parse(dataUsers)
    const name = dataPars[0].name
    const lastName = dataPars[0].lastName
    const email = dataPars[0].email
    const idQuiz = sessionStorage.getItem("id-quiz")
    const idQuizPars = JSON.parse(idQuiz)

    const xhr = new XMLHttpRequest()
    xhr.open(
      "POST",
      "https://testologia.site/pass-quiz?id=" + idQuizPars,
      false
    )
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhr.send(
      JSON.stringify({
        name: name,
        lastName: lastName,
        email: email,
        results: this.userResult
      })
    )

    if (xhr.status === 200 && xhr.responseText) {
      let result = null
      try {
        result = JSON.parse(xhr.responseText)
        let resultArr = []
        resultArr.push(result)
        sessionStorage.setItem(
          this.KEY_RESULT_RESPONSE,
          JSON.stringify(resultArr)
        )
      } catch (e) {
        location.href("#/")
      }
      if (result) {
        location.href = "#/result"
      }
    } else {
      location.href("#/")
    }
  }
}
