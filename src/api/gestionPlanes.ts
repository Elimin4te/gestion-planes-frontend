import axios from "./common"

export const listarPlanesAprendizaje = () => {
    return axios.get('gestion-planes/planes-aprendizaje')
}

export const listarPlanesEvaluacion = () => {
    return axios.get('gestion-planes/planes-aprendizaje')
}