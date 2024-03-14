import { CustomHttp } from "../services/castom-http.js"
import { Auth } from "../services/auth.js"
import config from "../config/config.js"

export class Form {
  constructor(page) {
    this.agreeElement = null
    this.processElement = null
    this.email = null
    this.page = page
    const accessToken = localStorage.getItem(Auth.accessTokenKey)
    if (accessToken) {
      location.href = "#/choice"
      return
    }

    this.fields = [{
      name: "email",
      id: "email",
      element: null,
      regex: /^[^ ]+@[^ ]+\.[a-z]{2,3}$/,
      valid: false
    }, {
      name: "password",
      id: "password",
      element: null,
      regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
      valid: false
    }]

    if (this.page === "signup") {
      this.fields.unshift({
        name: "name",
        id: "name",
        element: null,
        // regex: /^[А-Я][а-я]+\s*$/,
        valid: false
      }, {
        name: "lastName",
        id: "last-name",
        element: null,
        // regex: /^[А-Я][а-я]+\s*$/,
        valid: false
      })
    }

    const that = this

    this.fields.forEach(item => {
      item.element = document.getElementById(item.id)
      item.element.onchange = function() {
        that.validateField.call(that, item, this)
      }
    })

    // Находим кнопку отправки формы
    this.processElement = document.getElementById("process")
    this.processElement.onclick = function() {
      that.processForm()
    }

    if (this.page === "signup") {
      // Находим чекбокс
      this.agreeElement = document.getElementById("agree")
      // Вешаем обработчик по изменению значения
      this.agreeElement.onchange = function() {
        that.validateForm()
      }
    }
  }

  validateField(field, element) {
    if (!element.value || !element.value.match(field.regex)) {
      element.parentNode.style.borderColor = "red"
      field.valid = false
    } else {
      element.parentNode.removeAttribute("style")
      field.valid = true
    }
    // Вызываем функцию для проверки валидности полей
    this.validateForm()
  }

  // Проверить на то что все поля валидны
  validateForm() {
    const validForm = this.fields.every(el => el.valid)
    const isValid = this.agreeElement ? this.agreeElement.checked && validForm : validForm
    if (isValid) {
      this.processElement.removeAttribute("disabled")
    } else {
      this.processElement.setAttribute("disabled", "disabled")
    }

    return isValid
  }

  async processForm() {
    // Проверяем какая у нас страница
    if (this.validateForm()) {
      const email = this.fields.find(item => item.name === "email").element.value
      const password = this.fields.find(item => item.name === "password").element.value
      // Если страница регистрации отправляем запрос на бэк
      if (this.page === "signup") {
        try {
          // Отправляем данные на бекэнд
          const result = await CustomHttp.request(config.host + "/signup", "POST", {
            name: this.fields.find(item => item.name === "name").element.value,
            lastName: this.fields.find(item => item.name === "lastName").element.value,
            email: email,
            password: password
          })

          // Если прошло успешно
          if (result) {
            // Проверяем на ошибки и на то что мы получили данные пользователя
            // Если данные есть и ошибки нет то перенаправляем человека на след страницу
            if (result.error || !result.user) {
              throw new Error(result.message)
            }

            this.email = result.user.email
          }
        } catch (error) {
          return console.log(error)
        }
      }

      try {
        // Отправляем данные на бекэнд
        const result = await CustomHttp.request(config.host + "/login", "POST", {
          email: email,
          password: password
        })

        // Если прошло успешно
        if (result) {
          // Проверяем на ошибки и на то что мы получили данные пользователя
          // Если данные есть и ошибки нет то перенаправляем человека на след страницу
          if (result.error || !result.accessToken || !result.refreshToken || !result.fullName || !result.userId) {
            throw new Error(result.message)
          }
          // console.log(result)
          // Сохраняем токены в локальное хранилище,
          // Сохраняем инфо пользователя в локальное хранилище
          Auth.setTokens(result.accessToken, result.refreshToken)
          Auth.setUserInfo({
            fullName: result.fullName,
            userId: result.userId,
            email: this.email
          })
          // Перенаправление на страницу выбора теста
          location.href = "#/choice"
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
