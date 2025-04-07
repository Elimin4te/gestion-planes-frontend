import { AxiosResponse } from "axios"
import axios from "./common"
import { UnidadCurricular } from "./tipos"

export const listarUnidadesCurriculares = (): Promise<AxiosResponse<UnidadCurricular[]>> => {
    return axios.get('gestion-planes/unidades-curriculares/')
}

