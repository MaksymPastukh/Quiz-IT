/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _router_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./router.js */ \"./src/router.js\");\n\nclass App {\n  constructor() {\n    this.router = new _router_js__WEBPACK_IMPORTED_MODULE_0__.Router();\n    window.addEventListener(`DOMContentLoaded`, this.handleRouterChanging.bind(this));\n    window.addEventListener(`popstate`, this.handleRouterChanging.bind(this));\n  }\n  handleRouterChanging() {\n    this.router.openRoute();\n  }\n}\nnew App();\n\n//# sourceURL=webpack://quiz/./src/app.js?");

/***/ }),

/***/ "./src/components/choice.js":
/*!**********************************!*\
  !*** ./src/components/choice.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Choice: () => (/* binding */ Choice)\n/* harmony export */ });\n/* harmony import */ var _utils_store_manager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/store-manager.js */ \"./src/utils/store-manager.js\");\n\nclass Choice {\n  constructor() {\n    this.quizzes = [];\n    this.KEY_ID_QUIZ = \"id-quiz\";\n    new _utils_store_manager_js__WEBPACK_IMPORTED_MODULE_0__.StoreManager().checkUserData();\n    const xhr = new XMLHttpRequest();\n    xhr.open(\"GET\", \"https://testologia.site/get-quizzes\", false);\n    xhr.send();\n    if (xhr.status === 200 && xhr.responseText) {\n      try {\n        this.quizzes = JSON.parse(xhr.responseText);\n      } catch (e) {\n        location.href(\"#/\");\n      }\n      this.processQuizzes();\n    } else {\n      location.href(\"#/\");\n    }\n  }\n  processQuizzes() {\n    const choiceOptionsElement = document.getElementById(\"choice-options\");\n    if (this.quizzes && this.quizzes.length > 0) {\n      this.quizzes.forEach(quiz => {\n        const that = this;\n        const choiceOptionElement = document.createElement(\"div\");\n        choiceOptionElement.className = \"choice-option\";\n        choiceOptionElement.setAttribute(\"data-id\", quiz.id);\n        choiceOptionElement.onclick = function () {\n          that.chooseQuiz(this);\n        };\n        const choiceOptionTextElement = document.createElement(\"div\");\n        choiceOptionTextElement.className = \"choice-option-text\";\n        choiceOptionTextElement.innerText = quiz.name;\n        const choiceOptionArrowElement = document.createElement(\"div\");\n        choiceOptionArrowElement.className = \"choice-option-arrow\";\n        const choiceOptionImageElement = document.createElement(\"img\");\n        choiceOptionImageElement.setAttribute(\"src\", \"images/arrow.png\");\n        choiceOptionImageElement.setAttribute(\"alt\", \"Arrow\");\n        choiceOptionArrowElement.appendChild(choiceOptionImageElement);\n        choiceOptionElement.appendChild(choiceOptionTextElement);\n        choiceOptionElement.appendChild(choiceOptionArrowElement);\n        choiceOptionsElement.appendChild(choiceOptionElement);\n      });\n    }\n  }\n  chooseQuiz(element) {\n    const dataId = element.getAttribute(\"data-id\");\n    sessionStorage.setItem(this.KEY_ID_QUIZ, dataId);\n    if (dataId) {\n      location.href = \"#/test\";\n    }\n  }\n}\n\n//# sourceURL=webpack://quiz/./src/components/choice.js?");

/***/ }),

/***/ "./src/components/form.js":
/*!********************************!*\
  !*** ./src/components/form.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Form: () => (/* binding */ Form)\n/* harmony export */ });\nclass Form {\n  constructor() {\n    this.agreeElement = null;\n    this.processElement = null;\n    this.CLIENTS_KEY = \"clients\";\n    this.fields = [{\n      name: \"name\",\n      id: \"name\",\n      element: null,\n      // regex: /^[А-Я][а-я]+\\s*$/,\n      valid: false\n    }, {\n      name: \"lastName\",\n      id: \"last-name\",\n      element: null,\n      // regex: /^[А-Я][а-я]+\\s*$/,\n      valid: false\n    }, {\n      name: \"email\",\n      id: \"email\",\n      element: null,\n      regex: /^[^ ]+@[^ ]+\\.[a-z]{2,3}$/,\n      valid: false\n    }];\n    const that = this;\n    this.fields.forEach(item => {\n      item.element = document.getElementById(item.id);\n      item.element.onchange = function () {\n        that.validateField.call(that, item, this);\n      };\n    });\n\n    // Находим кнопку отправки формы\n    this.processElement = document.getElementById(\"process\");\n    this.processElement.onclick = function () {\n      that.processForm();\n    };\n\n    // Находим чекбокс\n    this.agreeElement = document.getElementById(\"agree\");\n    // Вешаем обработчик по изменению значения\n    this.agreeElement.onchange = function () {\n      that.validateForm();\n    };\n  }\n  validateField(field, element) {\n    if (!element.value || !element.value.match(field.regex)) {\n      element.parentNode.style.borderColor = \"red\";\n      field.valid = false;\n    } else {\n      element.parentNode.removeAttribute(\"style\");\n      field.valid = true;\n    }\n    // Вызываем функцию для проверки валидности полей\n    this.validateForm();\n  }\n\n  // Проверить на то что все поля валидны\n  validateForm() {\n    const validForm = this.fields.every(el => el.valid);\n    const isValid = this.agreeElement.checked && validForm;\n    if (isValid) {\n      this.processElement.removeAttribute(\"disabled\");\n    } else {\n      this.processElement.setAttribute(\"disabled\", \"disabled\");\n    }\n    return isValid;\n  }\n  processForm() {\n    if (this.validateForm()) {\n      let paramString = \"\";\n      let clients = sessionStorage.getItem(this.CLIENTS_KEY) ? JSON.parse(sessionStorage.getItem(this.CLIENTS_KEY)) : [];\n      this.fields.forEach(item => {\n        paramString += (!paramString ? \"?\" : \"&\") + item.name + \"=\" + item.element.value;\n      });\n      const entries = this.fields.map(item => {\n        return [item.name, item.element.value];\n      });\n      clients.push(Object.fromEntries(entries));\n      sessionStorage.setItem(this.CLIENTS_KEY, JSON.stringify(clients));\n      location.href = \"#/choice\";\n    }\n  }\n}\n\n//# sourceURL=webpack://quiz/./src/components/form.js?");

/***/ }),

/***/ "./src/components/result.js":
/*!**********************************!*\
  !*** ./src/components/result.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Result: () => (/* binding */ Result)\n/* harmony export */ });\n/* harmony import */ var _utils_store_manager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/store-manager.js */ \"./src/utils/store-manager.js\");\n\nclass Result {\n  constructor() {\n    new _utils_store_manager_js__WEBPACK_IMPORTED_MODULE_0__.StoreManager().checkUserData();\n    const resultQuiz = sessionStorage.getItem(\"result-response\");\n    const resultQuizPars = JSON.parse(resultQuiz);\n    resultQuizPars.forEach(item => {\n      document.getElementById(\"result-score\").innerText = item.score + \"/\" + item.total;\n    });\n    document.getElementById(\"result-value\").onclick = function () {\n      location.href = \"#/resultValue\";\n    };\n  }\n}\n\n//# sourceURL=webpack://quiz/./src/components/result.js?");

/***/ }),

/***/ "./src/components/resultValue.js":
/*!***************************************!*\
  !*** ./src/components/resultValue.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ResultValue: () => (/* binding */ ResultValue)\n/* harmony export */ });\n/* harmony import */ var _utils_store_manager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/store-manager.js */ \"./src/utils/store-manager.js\");\n\nclass ResultValue {\n  constructor() {\n    this.quiz = null;\n    this.preTitle = null;\n    this.resTitle = null;\n    this.resOptions = null;\n    this.resUserName = null;\n    this.resUserLastName = null;\n    this.resUserEmail = null;\n    this.rightAnswers = null;\n    new _utils_store_manager_js__WEBPACK_IMPORTED_MODULE_0__.StoreManager().checkUserData();\n    const dataUsers = sessionStorage.getItem(\"clients\");\n    const dataPars = JSON.parse(dataUsers);\n    const name = dataPars[0].name;\n    const lastName = dataPars[0].lastName;\n    const email = dataPars[0].email;\n    const idQuiz = sessionStorage.getItem(\"id-quiz\");\n    const idQuizPars = JSON.parse(idQuiz);\n    if (idQuizPars) {\n      const xhr = new XMLHttpRequest();\n      xhr.open(\"GET\", \"https://testologia.site/get-quiz?id=\" + idQuizPars, false);\n      xhr.send();\n      if (xhr.status === 200 && xhr.responseText) {\n        try {\n          this.quiz = JSON.parse(xhr.responseText);\n        } catch (e) {\n          location.href(\"#/\");\n        }\n        this.resultQuiz();\n        this.resUserName.innerHTML = `${name} ${lastName}, ${email}`;\n      } else {\n        location.href(\"#/\");\n      }\n    } else {\n      location.href(\"#/\");\n    }\n  }\n  resultQuiz() {\n    this.preTitle = document.getElementById(\"pre-title\");\n    this.resTitle = document.getElementById(\"res-title\");\n    this.resOptions = document.getElementById(\"res-options\");\n    this.resUserName = document.getElementById(\"user-name\");\n    this.resUserLastName = document.getElementById(\"user-lastName\");\n    this.resUserEmail = document.getElementById(\"user-email\");\n    this.showResultQuiz();\n    document.getElementById(\"result-value\").onclick = function () {\n      location.href = \"#/result\";\n    };\n  }\n  showResultQuiz() {\n    this.preTitle.innerHTML = this.quiz.name;\n    this.match();\n    let resultUser = sessionStorage.getItem(\"result-quiz\");\n    let resultUserPars = JSON.parse(resultUser);\n    const resultUserID = resultUserPars.map((item, index) => {\n      return item.chosenAnswerId;\n    });\n    this.quiz.questions.map((item, index) => {\n      this.resTitle = document.createElement(\"div\");\n      this.resTitle.className = \"result-question-title\";\n      this.resTitle.innerHTML = `\n\t\t\t\t<span>Вопрос ${index + 1} : </span> \n\t\t\t\t${item.question}\n\t\t`;\n      this.resOptions.appendChild(this.resTitle);\n      item.answers.forEach(item => {\n        const inputId = `answer-${item.id}`;\n        const optionElement = document.createElement(\"div\");\n        optionElement.className = \"result-question-option\";\n        const inputElement = document.createElement(\"input\");\n        inputElement.className = \"option-answer\";\n        inputElement.setAttribute(\"id\", inputId);\n        inputElement.setAttribute(\"type\", \"radio\");\n        inputElement.setAttribute(\"name\", \"answer\");\n        inputElement.setAttribute(\"value\", item.id);\n        const labelElement = document.createElement(\"label\");\n        labelElement.setAttribute(\"for\", inputId);\n        labelElement.innerText = item.answer;\n        resultUserID.forEach(itemUserIDquiz => {\n          if (item.id === itemUserIDquiz && this.rightAnswers.includes(item.id)) {\n            console.log(true);\n            labelElement.className = \"result-success\";\n            inputElement.className = \"result-input-success\";\n          } else if (item.id === itemUserIDquiz && !this.rightAnswers.includes(item.id)) {\n            console.log(false);\n            labelElement.className = \"result-error\";\n            inputElement.className = \"result-input-error\";\n          }\n        });\n        optionElement.appendChild(inputElement);\n        optionElement.appendChild(labelElement);\n        this.resOptions.appendChild(optionElement);\n      });\n    });\n  }\n  match() {\n    const idQuiz = sessionStorage.getItem(\"id-quiz\");\n    const idQuizPars = JSON.parse(idQuiz);\n    const xhr = new XMLHttpRequest();\n    xhr.open(\"GET\", \"https://testologia.site/get-quiz-right?id=\" + idQuizPars, false);\n    xhr.send();\n    if (xhr.status === 200 && xhr.responseText) {\n      try {\n        this.rightAnswers = JSON.parse(xhr.responseText);\n      } catch (e) {\n        location.href(\"#/\");\n      }\n    } else {\n      location.href(\"#/\");\n    }\n  }\n}\n\n//# sourceURL=webpack://quiz/./src/components/resultValue.js?");

/***/ }),

/***/ "./src/components/test.js":
/*!********************************!*\
  !*** ./src/components/test.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Test: () => (/* binding */ Test)\n/* harmony export */ });\n/* harmony import */ var _utils_store_manager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/store-manager.js */ \"./src/utils/store-manager.js\");\n\nclass Test {\n  constructor() {\n    this.progressBarElement = null;\n    this.nextButtonElement = null;\n    this.passButtonElement = null;\n    this.prevButtonElement = null;\n    this.questionTitleElement = null;\n    this.optionsElement = null;\n    this.quiz = null;\n    this.currentQuestionIndex = 1;\n    this.userResult = [];\n    this.KEY_RESULT_QUIZ = \"result-quiz\";\n    this.KEY_RESULT_RESPONSE = \"result-response\";\n    new _utils_store_manager_js__WEBPACK_IMPORTED_MODULE_0__.StoreManager().checkUserData();\n    const id = sessionStorage.getItem(\"id-quiz\");\n    const idPars = JSON.parse(id);\n    if (idPars) {\n      const xhr = new XMLHttpRequest();\n      xhr.open(\"GET\", \"https://testologia.site/get-quiz?id=\" + idPars, false);\n      xhr.send();\n      if (xhr.status === 200 && xhr.responseText) {\n        try {\n          this.quiz = JSON.parse(xhr.responseText);\n        } catch (e) {\n          location.href(\"#/\");\n        }\n        this.startQuiz();\n      } else {\n        location.href(\"#/\");\n      }\n    } else {\n      location.href(\"#/\");\n    }\n  }\n  startQuiz() {\n    this.progressBarElement = document.getElementById(\"progress-bar\");\n    this.questionTitleElement = document.getElementById(\"title\");\n    this.optionsElement = document.getElementById(\"options\");\n\n    // Далее\n    this.nextButtonElement = document.getElementById(\"next\");\n    this.nextButtonElement.onclick = this.move.bind(this, \"next\");\n    // Пропустить\n    this.passButtonElement = document.getElementById(\"pass\");\n    this.passButtonElement.onclick = this.move.bind(this, \"pass\");\n    document.getElementById(\"pre-title\").innerText = this.quiz.name;\n    // Назад\n    this.prevButtonElement = document.getElementById(\"prev\");\n    this.prevButtonElement.onclick = this.move.bind(this, \"prev\");\n\n    // Отображаем вопрос и варианты ответа\n    this.prepareProgressBar();\n    this.showQuestion();\n\n    // Таймер теста\n    const timerElement = document.getElementById(\"timer\");\n    let seconds = 159;\n    const interval = setInterval(function () {\n      seconds--;\n      timerElement.innerText = seconds;\n      if (seconds === 0) {\n        clearInterval(interval);\n        this.complete();\n      }\n    }.bind(this), 1000);\n  }\n  prepareProgressBar() {\n    for (let i = 0; i < this.quiz.questions.length; i++) {\n      const itemElement = document.createElement(\"div\");\n      itemElement.className = \"test-progress-bar-item \" + (i === 0 ? \"active\" : \"\");\n      const itemCircleElement = document.createElement(\"div\");\n      itemCircleElement.className = \"test-progress-bar-item-circle\";\n      const itemTextElement = document.createElement(\"div\");\n      itemTextElement.className = \"test-progress-bar-item-text\";\n      itemTextElement.innerText = `Вопрос ${i + 1}`;\n      itemElement.appendChild(itemCircleElement);\n      itemElement.appendChild(itemTextElement);\n      this.progressBarElement.appendChild(itemElement);\n    }\n  }\n  showQuestion() {\n    const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];\n    console.log(activeQuestion.question);\n    this.questionTitleElement.innerHTML = `\n          <span>Вопрос ${this.currentQuestionIndex} - </span> \n          ${activeQuestion.question}\n      `;\n    this.optionsElement.innerHTML = \"\";\n    const that = this;\n    const chosenOption = this.userResult.find(item => item.questionId === activeQuestion.id);\n    that.choose();\n    activeQuestion.answers.forEach(answer => {\n      const inputId = `answer-${answer.id}`;\n      const optionElement = document.createElement(\"div\");\n      optionElement.className = \"test-question-option\";\n      const inputElement = document.createElement(\"input\");\n      inputElement.className = \"option-answer\";\n      inputElement.setAttribute(\"id\", inputId);\n      inputElement.setAttribute(\"type\", \"radio\");\n      inputElement.setAttribute(\"name\", \"answer\");\n      inputElement.setAttribute(\"value\", answer.id);\n      if (chosenOption && chosenOption.chosenAnswerId === answer.id) {\n        inputElement.setAttribute(\"checked\", \"checked\");\n      }\n      inputElement.onchange = function () {\n        that.chooseAnswer();\n      };\n      const labelElement = document.createElement(\"label\");\n      labelElement.setAttribute(\"for\", inputId);\n      labelElement.innerText = answer.answer;\n      optionElement.appendChild(inputElement);\n      optionElement.appendChild(labelElement);\n      this.optionsElement.appendChild(optionElement);\n    });\n\n    // Проверяем на то есть ли у нас ответ на вопрос\n    // (Если ответ на вопрос есть тогда делаем кнопку доступной) иначе (кнопка заблокирована)\n    if (chosenOption && chosenOption.chosenAnswerId) {\n      this.nextButtonElement.removeAttribute(\"disabled\");\n    } else {\n      this.nextButtonElement.setAttribute(\"disabled\", \"disabled\");\n    }\n\n    // Проверка (Если последний вопрос то меняем значение кнопки Далее на Завершить) иначе (Возвращаем значение)\n    if (this.currentQuestionIndex === this.quiz.questions.length) {\n      this.nextButtonElement.innerHTML = \"Завершить\";\n    } else {\n      this.nextButtonElement.innerHTML = \"Далее\";\n    }\n\n    // Проверка (Если второй вопрос добавляем возможность работать с кнопкой \"Назад\") иначе (Кнопка заблокирована)\n    if (this.currentQuestionIndex > 1) {\n      this.prevButtonElement.removeAttribute(\"disabled\");\n    } else {\n      this.prevButtonElement.setAttribute(\"disabled\", \"disabled\");\n    }\n  }\n  chooseAnswer() {\n    this.passButtonElement.classList.add(\"disabled\");\n    this.nextButtonElement.removeAttribute(\"disabled\");\n  }\n  choose() {\n    this.passButtonElement.classList.remove(\"disabled\");\n  }\n  move(action) {\n    // Получаем результаты теста и записываем в массив\n    const activeQuestionId = this.quiz.questions[this.currentQuestionIndex - 1];\n    const chosenAnswer = Array.from(document.getElementsByClassName(\"option-answer\")).find(el => {\n      return el.checked;\n    });\n    let chosenAnswerId = null;\n    if (chosenAnswer && chosenAnswer.value) {\n      chosenAnswerId = Number(chosenAnswer.value);\n    }\n\n    // Проверяем есть ли уже в массиве обект для такого questionId\n    const existingResult = this.userResult.find(item => {\n      return item.questionId === activeQuestionId.id;\n    });\n    if (existingResult) {\n      existingResult.chosenAnswerId = chosenAnswerId;\n    } else {\n      this.userResult.push({\n        questionId: activeQuestionId.id,\n        chosenAnswerId: chosenAnswerId\n      });\n    }\n    sessionStorage.setItem(this.KEY_RESULT_QUIZ, JSON.stringify(this.userResult));\n\n    // Пагинация\n    if (action === \"next\" || action === \"pass\") {\n      this.currentQuestionIndex++;\n    } else {\n      this.currentQuestionIndex--;\n    }\n    if (this.currentQuestionIndex > this.quiz.questions.length) {\n      this.complete();\n      return;\n    }\n    Array.from(this.progressBarElement.children).forEach((item, index) => {\n      const currentItemIndex = index + 1;\n      item.classList.remove(\"complete\");\n      item.classList.remove(\"active\");\n      if (currentItemIndex === this.currentQuestionIndex) {\n        item.classList.add(\"active\");\n      } else if (currentItemIndex < this.currentQuestionIndex) {\n        item.classList.add(\"complete\");\n      }\n    });\n    this.showQuestion();\n  }\n  complete() {\n    const dataUsers = sessionStorage.getItem(\"clients\");\n    const dataPars = JSON.parse(dataUsers);\n    const name = dataPars[0].name;\n    const lastName = dataPars[0].lastName;\n    const email = dataPars[0].email;\n    const idQuiz = sessionStorage.getItem(\"id-quiz\");\n    const idQuizPars = JSON.parse(idQuiz);\n    const xhr = new XMLHttpRequest();\n    xhr.open(\"POST\", \"https://testologia.site/pass-quiz?id=\" + idQuizPars, false);\n    xhr.setRequestHeader(\"Content-Type\", \"application/json;charset=UTF-8\");\n    xhr.send(JSON.stringify({\n      name: name,\n      lastName: lastName,\n      email: email,\n      results: this.userResult\n    }));\n    if (xhr.status === 200 && xhr.responseText) {\n      let result = null;\n      try {\n        result = JSON.parse(xhr.responseText);\n        let resultArr = [];\n        resultArr.push(result);\n        sessionStorage.setItem(this.KEY_RESULT_RESPONSE, JSON.stringify(resultArr));\n      } catch (e) {\n        location.href(\"#/\");\n      }\n      if (result) {\n        location.href = \"#/result\";\n      }\n    } else {\n      location.href(\"#/\");\n    }\n  }\n}\n\n//# sourceURL=webpack://quiz/./src/components/test.js?");

/***/ }),

/***/ "./src/router.js":
/*!***********************!*\
  !*** ./src/router.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Router: () => (/* binding */ Router)\n/* harmony export */ });\n/* harmony import */ var _components_form_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/form.js */ \"./src/components/form.js\");\n/* harmony import */ var _components_choice_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/choice.js */ \"./src/components/choice.js\");\n/* harmony import */ var _components_test_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/test.js */ \"./src/components/test.js\");\n/* harmony import */ var _components_result_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/result.js */ \"./src/components/result.js\");\n/* harmony import */ var _components_resultValue_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/resultValue.js */ \"./src/components/resultValue.js\");\n\n\n\n\n\nclass Router {\n  constructor() {\n    this.routes = [{\n      route: \"#/\",\n      title: \"Главная\",\n      template: \"templates/index.html\",\n      styles: \"styles/style.css\",\n      load: () => {}\n    }, {\n      route: \"#/form\",\n      title: \"Регистрация\",\n      template: \"templates/form.html\",\n      styles: \"styles/form.css\",\n      load: () => {\n        new _components_form_js__WEBPACK_IMPORTED_MODULE_0__.Form();\n      }\n    }, {\n      route: \"#/choice\",\n      title: \"Test selection\",\n      template: \"templates/choice.html\",\n      styles: \"styles/choice.css\",\n      load: () => {\n        new _components_choice_js__WEBPACK_IMPORTED_MODULE_1__.Choice();\n      }\n    }, {\n      route: \"#/test\",\n      title: \"Taking the test\",\n      template: \"templates/test.html\",\n      styles: \"styles/test.css\",\n      load: () => {\n        new _components_test_js__WEBPACK_IMPORTED_MODULE_2__.Test();\n      }\n    }, {\n      route: \"#/result\",\n      title: \"Outcomes\",\n      template: \"templates/result.html\",\n      styles: \"styles/result.css\",\n      load: () => {\n        new _components_result_js__WEBPACK_IMPORTED_MODULE_3__.Result();\n      }\n    }, {\n      route: \"#/resultValue\",\n      title: \"Detailed outcomes\",\n      template: \"templates/resultValue.html\",\n      styles: \"styles/resultValue.css\",\n      load: () => {\n        new _components_resultValue_js__WEBPACK_IMPORTED_MODULE_4__.ResultValue();\n      }\n    }];\n  }\n  async openRoute() {\n    const newRoute = this.routes.find(item => item.route === window.location.hash.split(\"?\")[0]);\n    if (!newRoute) {\n      window.location.href = \"#/\";\n      return;\n    }\n    document.getElementById(\"content\").innerHTML = await fetch(newRoute.template).then(response => response.text());\n    document.getElementById(\"styles\").setAttribute(\"href\", newRoute.styles);\n    document.getElementById(\"page-title\").innerText = newRoute.title;\n    newRoute.load();\n  }\n}\n\n//# sourceURL=webpack://quiz/./src/router.js?");

/***/ }),

/***/ "./src/utils/store-manager.js":
/*!************************************!*\
  !*** ./src/utils/store-manager.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   StoreManager: () => (/* binding */ StoreManager)\n/* harmony export */ });\nclass StoreManager {\n  checkUserData() {\n    const data = sessionStorage.getItem(\"clients\");\n    if (data) {\n      let dataPars = JSON.parse(data);\n      dataPars.forEach(item => {\n        const name = item.name;\n        const lastName = item.lastName;\n        const email = item.email;\n        if (!name && !lastName && !email) {\n          location.href = \"#/\";\n        }\n      });\n    }\n  }\n}\n\n//# sourceURL=webpack://quiz/./src/utils/store-manager.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.js");
/******/ 	
/******/ })()
;