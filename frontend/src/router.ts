import {Form} from "./components/form"
import {Choice} from "./components/choice"
import {Test} from "./components/test"
import {Result} from "./components/result"
import {ResultValue} from "./components/resultValue"
import {Auth} from "./services/auth"
import {RouteType} from "./types/route.type";
import {UserInfoType} from "./types/user-info.type";

export class Router {
  readonly contentElement: HTMLElement | null
  readonly stylesElement: HTMLElement | null
  readonly pageTitleElement: HTMLElement | null
  readonly profileElement: HTMLElement | null
  readonly profileFullNameElement: HTMLElement | null

  private routes: RouteType[]

  constructor() {
    this.contentElement = document.getElementById("content")
    this.stylesElement = document.getElementById("styles")
    this.pageTitleElement = document.getElementById("page-title")
    this.profileElement = document.getElementById("profile")
    this.profileFullNameElement = document.getElementById("profile-full-name")


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
        route: "#/signup",
        title: "Регистрация",
        template: "templates/signup.html",
        styles: "styles/form.css",
        load: () => {
          new Form("signup")
        }
      },
      {
        route: "#/login",
        title: "Вход в систему",
        template: "templates/login.html",
        styles: "styles/form.css",
        load: () => {
          new Form("login")
        }
      },
      {
        route: "#/choice",
        title: "Test selection",
        template: "templates/choice.html",
        styles: "styles/choice.css",
        load: () => {
          new Choice()
        }
      },
      {
        route: "#/test",
        title: "Taking the test",
        template: "templates/test.html",
        styles: "styles/test.css",
        load: () => {
          new Test()
        }
      },
      {
        route: "#/result",
        title: "Outcomes",
        template: "templates/result.html",
        styles: "styles/result.css",
        load: () => {
          new Result()
        }
      },
      {
        route: "#/resultValue",
        title: "Detailed outcomes",
        template: "templates/resultValue.html",
        styles: "styles/resultValue.css",
        load: () => {
          new ResultValue()
        }
      }
    ]
  }

  public async openRoute(): Promise<void> {
    const urlRoute: string = window.location.hash.split("?")[0]

    if (urlRoute === "#/logout") {
      const result: boolean = await Auth.logout()
      if (result) {
        window.location.href = "#/"
        return
      }
    }

    const newRoute: RouteType | undefined =
      this.routes.find(item => item.route === urlRoute)

    if (!newRoute) {
      window.location.href = "#/"
      return
    }

    if (!this.contentElement || !this.stylesElement || !this.pageTitleElement
      || !this.profileElement || !this.profileFullNameElement || !this.profileElement) {
      if (urlRoute === '/') {
        return
      } else {
        window.location.href = "#/"
        return
      }
    }

    this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text())
    this.stylesElement.setAttribute("href", newRoute.styles)
    this.pageTitleElement.innerText = newRoute.title

    const userInfo: UserInfoType | null = Auth.getUserInfo()
    const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey)
    if (userInfo && accessToken) {
      this.profileElement.style.display = "flex"
      this.profileFullNameElement.innerText = userInfo.fullName
    } else {
      this.profileElement.style.display = "none"
    }

    newRoute.load()
  }
}