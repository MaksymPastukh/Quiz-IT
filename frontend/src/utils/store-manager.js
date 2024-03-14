export class StoreManager {
  static getQueryParams() {
    const sq = document.location.hash.split("+").join(" ")

    let params = {},
      tokens,
      re = /[?&]([^=]+)=([^&]*)/g

    while (tokens = re.exec(sq)) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2])
    }

    return params
  }
}

