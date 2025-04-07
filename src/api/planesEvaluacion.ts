import { AxiosResponse } from "axios"
import axios from "./common"
import { PlanDeEvaluacion, ItemPlanEvaluacion, Extendible } from "./tipos"

export const listarPlanesEvaluacion = (): Promise<AxiosResponse<PlanDeEvaluacion[]>>  => {
    return axios.get('gestion-planes/planes-evaluacion/')
}

export const crearPlanEvaluacion = (pe: PlanDeEvaluacion): Promise<AxiosResponse<PlanDeEvaluacion>> => {
    return axios.post('gestion-planes/planes-evaluacion/', pe)
}

export const descargarPlanEvaluacion = (codigo_pe: string | number) => {
    return axios.get(`gestion-planes/planes-evaluacion/${codigo_pe}/descargar`)
}

export const eliminarPlanEvaluacion = (codigo_pe: string | number) => {
    return axios.delete(`gestion-planes/planes-evaluacion/${codigo_pe}/`)
}

export const actualizarPlanEvaluacion = (codigo_pe: string | number, datos: Extendible): Promise<AxiosResponse<PlanDeEvaluacion>> => {
    return axios.patch(`gestion-planes/planes-evaluacion/${codigo_pe}/`, datos)
}

export const listarItemsPlanEvaluacion = (): Promise<AxiosResponse<ItemPlanEvaluacion[]>> => {
    return axios.get(`gestion-planes/items-evaluacion`)
}

export const crearItemPlanEvaluacion = (ipe: ItemPlanEvaluacion): Promise<AxiosResponse<ItemPlanEvaluacion>> => {
    return axios.post('gestion-planes/items-evaluacion/', ipe)
}

export const eliminarItemPlanEvaluacion = (id_ipe: string | number) => {
    return axios.delete(`gestion-planes/items-evaluacion/${id_ipe}/`)
}

export const actualizarItemPlanEvaluacion = (id_ipe: string | number, datos: Extendible): Promise<AxiosResponse<PlanDeEvaluacion>> => {
    return axios.patch(`gestion-planes/items-evaluacion/${id_ipe}/`, datos)
}

