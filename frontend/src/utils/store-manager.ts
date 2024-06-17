import {QueryParamsType} from "../types/query-params.type";

export class StoreManager {
  public static getQueryParams(): QueryParamsType {
    const sq: string = document.location.hash.split("+").join(" ")

    let params: QueryParamsType = {},
      tokens : RegExpExecArray | null,
      re: RegExp = /[?&]([^=]+)=([^&]*)/g

    while (tokens = re.exec(sq)) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2])
    }

    return params
  }
}

