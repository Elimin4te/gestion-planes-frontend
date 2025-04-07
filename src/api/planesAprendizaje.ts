import { AxiosResponse } from "axios"
import axios from "./common"
import { PlanDeAprendizaje, ObjetivoPlanAprendizaje, Extendible } from "./tipos"

export const listarPlanesAprendizaje = (): Promise<AxiosResponse<PlanDeAprendizaje[]>>  => {
    return axios.get('gestion-planes/planes-aprendizaje/')
}

export const crearPlanAprendizaje = (pa: PlanDeAprendizaje): Promise<AxiosResponse<PlanDeAprendizaje>> => {
    return axios.post('gestion-planes/planes-aprendizaje/', pa)
}

export const descargarPlanAprendizaje = (codigo_pa: string | number) => {
    return axios.get(`gestion-planes/planes-aprendizaje/${codigo_pa}/descargar`, { responseType: 'blob' })
}

export const eliminarPlanAprendizaje = (codigo_pa: string | number) => {
    return axios.delete(`gestion-planes/planes-aprendizaje/${codigo_pa}/`)
}

export const actualizarPlanAprendizaje = (codigo_pa: string | number, datos: Extendible): Promise<AxiosResponse<PlanDeAprendizaje>> => {
    return axios.patch(`gestion-planes/planes-aprendizaje/${codigo_pa}/`, datos)
}

export const crearObjetivoPlanAprendizaje = (opa: ObjetivoPlanAprendizaje): Promise<AxiosResponse<ObjetivoPlanAprendizaje>> => {
    return axios.post('gestion-planes/objetivos-aprendizaje/', opa)
}

export const eliminarObjetivoPlanAprendizaje = (id_opa: string | number) => {
    return axios.delete(`gestion-planes/objetivos-aprendizaje/${id_opa}/`)
}

export const actualizarObjetivoPlanAprendizaje = (id_opa: string | number, datos: Extendible): Promise<AxiosResponse<PlanDeAprendizaje>> => {
    return axios.patch(`gestion-planes/objetivos-aprendizaje/${id_opa}/`, datos)
}

