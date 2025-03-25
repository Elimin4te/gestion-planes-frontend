import axios from "./common"
import Cookies from "js-cookie"


export const login = (cedula: string) => {

    // Limpia la cedula
    if (!cedula.startsWith('V-')) {
        cedula = 'V-' + cedula
    }
    cedula = cedula.split('.').join('')
    cedula = cedula.split('_').join('')

    return axios.post('autenticacion-docente/login', {'cedula': cedula})
}


export const logout = () => {

  // Elimina la cookie de cedula
  axios.get('autenticacion-docente/logout').then(
    () => Cookies.remove(import.meta.env.VITE_AUTH_COOKIE)
  ).catch(
    (err) => console.log("Ocurrió un error al cerrar sesión:", err)
  )
}

export const infoDocente = () => {
    return axios.get('autenticacion-docente/info')
}