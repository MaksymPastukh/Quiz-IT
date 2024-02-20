export class Form {
  constructor() {
    this.agreeElement = null
    this.processElement = null
    this.CLIENTS_KEY = "clients"
    this.fields = [
      {
        name: "name",
        id: "name",
        element: null,
        // regex: /^[А-Я][а-я]+\s*$/,
        valid: false
      },
      {
        name: "lastName",
        id: "last-name",
        element: null,
        // regex: /^[А-Я][а-я]+\s*$/,
        valid: false
      },
      {
        name: "email",
        id: "email",
        element: null,
        regex: /^[^ ]+@[^ ]+\.[a-z]{2,3}$/,
        valid: false
      }
    ]

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

    // Находим чекбокс
    this.agreeElement = document.getElementById("agree")
    // Вешаем обработчик по изменению значения
    this.agreeElement.onchange = function() {
      that.validateForm()
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
    const isValid = this.agreeElement.checked && validForm
    if (isValid) {
      this.processElement.removeAttribute("disabled")
    } else {
      this.processElement.setAttribute("disabled", "disabled")
    }

    return isValid
  }

  processForm() {
    if (this.validateForm()) {
      let paramString = ""
      let clients = sessionStorage.getItem(this.CLIENTS_KEY)
        ? JSON.parse(sessionStorage.getItem(this.CLIENTS_KEY))
        : []

      this.fields.forEach(item => {
        paramString +=
          (!paramString ? "?" : "&") + item.name + "=" + item.element.value
      })

      const entries = this.fields.map(item => {
        return [item.name, item.element.value]
      })

      clients.push(Object.fromEntries(entries))

      sessionStorage.setItem(this.CLIENTS_KEY, JSON.stringify(clients))
      location.href = "#/choice"
    }
  }
}

