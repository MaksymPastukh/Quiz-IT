import { StoreManager } from "../utils/store-manager.js"

export class ResultValue {
  constructor() {
    this.quiz = null
    this.preTitle = null
    this.resTitle = null
    this.resOptions = null
    this.resUserName = null
    this.resUserLastName = null
    this.resUserEmail = null
    this.rightAnswers = null

    new StoreManager().checkUserData()
    const dataUsers = sessionStorage.getItem("clients")
    const dataPars = JSON.parse(dataUsers)
    const name = dataPars[0].name
    const lastName = dataPars[0].lastName
    const email = dataPars[0].email
    const idQuiz = sessionStorage.getItem("id-quiz")
    const idQuizPars = JSON.parse(idQuiz)
    if (idQuizPars) {
      const xhr = new XMLHttpRequest()
      xhr.open(
        "GET",
        "https://testologia.site/get-quiz?id=" + idQuizPars,
        false
      )
      xhr.send()

      if (xhr.status === 200 && xhr.responseText) {
        try {
          this.quiz = JSON.parse(xhr.responseText)
        } catch (e) {
          location.href("#/")
        }
        this.resultQuiz()
        this.resUserName.innerHTML = `${name} ${lastName}, ${email}`
      } else {
        location.href("#/")
      }
    } else {
      location.href("#/")
    }
  }

  resultQuiz() {
    this.preTitle = document.getElementById("pre-title")
    this.resTitle = document.getElementById("res-title")
    this.resOptions = document.getElementById("res-options")
    this.resUserName = document.getElementById("user-name")
    this.resUserLastName = document.getElementById("user-lastName")
    this.resUserEmail = document.getElementById("user-email")

    this.showResultQuiz()

    document.getElementById("result-value").onclick = function() {
      location.href = "#/result"
    }
  }

  showResultQuiz() {
    this.preTitle.innerHTML = this.quiz.name
    this.match()
    let resultUser = sessionStorage.getItem("result-quiz")
    let resultUserPars = JSON.parse(resultUser)
    const resultUserID = resultUserPars.map((item, index) => {
      return item.chosenAnswerId
    })

    this.quiz.questions.map((item, index) => {
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

        resultUserID.forEach(itemUserIDquiz => {
          if (
            item.id === itemUserIDquiz &&
            this.rightAnswers.includes(item.id)
          ) {
            console.log(true)
            labelElement.className = "result-success"
            inputElement.className = "result-input-success"
          } else if (
            item.id === itemUserIDquiz &&
            !this.rightAnswers.includes(item.id)
          ) {
            console.log(false)
            labelElement.className = "result-error"
            inputElement.className = "result-input-error"
          }
        })

        optionElement.appendChild(inputElement)
        optionElement.appendChild(labelElement)
        this.resOptions.appendChild(optionElement)
      })
    })
  }

  match() {
    const idQuiz = sessionStorage.getItem("id-quiz")
    const idQuizPars = JSON.parse(idQuiz)
    const xhr = new XMLHttpRequest()
    xhr.open(
      "GET",
      "https://testologia.site/get-quiz-right?id=" + idQuizPars,
      false
    )
    xhr.send()

    if (xhr.status === 200 && xhr.responseText) {
      try {
        this.rightAnswers = JSON.parse(xhr.responseText)
      } catch (e) {
        location.href("#/")
      }
    } else {
      location.href("#/")
    }
  }
}
