import {CustomHttp} from "../services/castom-http"
import {Auth} from "../services/auth"
import config from "../config/config"
import {FormFieldType} from "../types/form-field.type";
import {SignupResponseType} from "../types/signup-response.type";
import {LoginResponseType} from "../types/login-response.type";

export class Form {
  readonly agreeElement: HTMLInputElement | null = null
  readonly processElement: HTMLElement | null = null
  private email: string | null | undefined
  readonly page: 'signup' | 'login'
  private fields: FormFieldType[] = [];

  // Указываем параметр page для того что управлять аутентификацией
  constructor(page: 'signup' | 'login') {
    this.page = page
    this.email = null

    const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey)
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


    // Если страница === регистрации тогда добавляем в начало массива fields два новых обьекта
    if (this.page === "signup") {
      this.fields.unshift({
        name: "name",
        id: "name",
        element: null,
        regex: /^[А-Я][а-я]+\s*$/,
        valid: false
      }, {
        name: "lastName",
        id: "last-name",
        element: null,
        regex: /^[А-Я][а-я]+\s*$/,
        valid: false
      })
    }

    const that: Form = this

    this.fields.forEach((item: FormFieldType): void => {
      item.element = document.getElementById(item.id) as HTMLInputElement
      if (item.element) {
        item.element.onchange = function (): void {
          that.validateField.call(that, item, <HTMLInputElement>this)
        }
      }
    })

    // Находим кнопку отправки формы
    this.processElement = document.getElementById("process")
    if (this.processElement) {
      this.processElement.onclick = function () {
        that.processForm()
      }
    }


    // Ecли открыта страница регистрации то проверяем чекбокс
    if (this.page === "signup") {
      // Находим чекбокс
      this.agreeElement = document.getElementById("agree") as HTMLInputElement
      if (this.agreeElement) {
        // Вешаем обработчик по изменению значения
        this.agreeElement.onchange = function () {
          that.validateForm()
        }
      }
    }
  }

  private validateField(field: FormFieldType, element: HTMLInputElement): void {
    if (element.parentNode) {
      if (!element.value || !element.value.match(field.regex)) {
        (element.parentNode as HTMLElement).style.borderColor = "red"
        field.valid = false
      } else {
        (element.parentNode as HTMLElement).removeAttribute("style")
        field.valid = true
      }
    }
    // Вызываем функцию для проверки валидности полей
    this.validateForm()
  }

  // Проверить на то что все поля валидны
  private validateForm(): boolean {
    const validForm: boolean = this.fields.every((el: FormFieldType) => el.valid)
    const isValid: boolean = this.agreeElement ? this.agreeElement.checked && validForm : validForm
    if (this.processElement) {
      if (isValid) {
        this.processElement.removeAttribute("disabled")
      } else {
        this.processElement.setAttribute("disabled", "disabled")
      }
    }
    return isValid
  }

  private async processForm(): Promise<void> {
    // Проверяем какая у нас страница
    if (this.validateForm()) {
      const email = this.fields.find(item => item.name === "email")?.element?.value
      const password = this.fields.find(item  => item.name === "password")?.element?.value
      // Если страница регистрации отправляем запрос на бэк
      if (this.page === "signup") {
        try {
          // Отправляем данные на бекэнд
          const result: SignupResponseType = await CustomHttp.request(config.host + "/signup", "POST", {
            name: this.fields.find(item => item.name === "name")?.element?.value,
            lastName: this.fields.find(item => item.name === "lastName")?.element?.value,
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
        const result : LoginResponseType = await CustomHttp.request(config.host + "/login", "POST", {
          email: email,
          password: password
        })

        // Если прошло успешно
        if (result) {
          console.log(result)
          // Проверяем на ошибки и на то что мы получили данные пользователя
          // Если данные есть и ошибки нет то перенаправляем человека на след страницу
          if (result.error || !result.accessToken || !result.refreshToken || !result.fullName || !result.userId) {
            throw new Error(result.message)
          }
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
