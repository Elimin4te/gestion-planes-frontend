import axios from 'axios';
import { camelCase, mapKeys } from 'lodash';

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export default axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    withCredentials: true
})

export const formatearObjeto = (obj: object): any => {

  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(formatearObjeto);
  }

  let formeateado: object = mapKeys(obj, (_, key) => camelCase(key))
  return formeateado;
}
