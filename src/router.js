import { Form } from "./components/form.js"

export class Router {
  constructor() {
    this.routes = [
      {
        route: "#/",
        title: "Главная",
        template: "templates/index.html",
        styles: "styles/style.css",
        load: () => {
        }
      },
      {
        route: "#/form",
        title: "Регистрация",
        template: "templates/form.html",
        styles: "styles/form.css",
        load: () => {
          new Form()
        }
      }
    ]
  }

  async openRoute() {
    const newRoute =
      this.routes.find(item => item.route === window.location.hash)

    if (!newRoute) {
      window.location.href = "#/"
      return
    }
  
    document.getElementById('content').innerHTML =
      await fetch(newRoute.template).then(response => response.text())
    document.getElementById('styles').setAttribute('href', newRoute.styles)
    document.getElementById('title').innerText = newRoute.title
    newRoute.load()
  }
}