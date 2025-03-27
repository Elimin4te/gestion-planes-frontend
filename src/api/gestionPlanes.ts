import axios from "./common"

export const listarPlanesAprendizaje = () => {
    return axios.get('gestion-planes/planes-aprendizaje')
}

export const descargarPlanAprendizaje = (codigo_pa: string) => {
    return axios.get(`gestion-planes/planes-aprendizaje/${codigo_pa}/descargar`)
}

export const eliminarPlanAprendizaje = (codigo_pa: string) => {
    return axios.delete(`gestion-planes/planes-aprendizaje/${codigo_pa}`)
}

export const listarPlanesEvaluacion = () => {
    return axios.get('gestion-planes/planes-evaluacion')
}

