import {
    listarPlanesAprendizaje,
    crearPlanAprendizaje,
    descargarPlanAprendizaje,
    eliminarPlanAprendizaje,
    actualizarPlanAprendizaje,
    crearObjetivoPlanAprendizaje,
    actualizarObjetivoPlanAprendizaje,
    eliminarObjetivoPlanAprendizaje
} from "@src/api/planesAprendizaje"

import { listarItemsPlanEvaluacion } from "@src/api/planesEvaluacion"

import { listarUnidadesCurriculares } from "@src/api/unidadesCurriculares"

import {
    PlanDeAprendizaje,
    ObjetivoPlanAprendizaje,
    turnos,
    nucleos,
    Extendible,
    instrumentosEvaluacion
} from "@src/api/tipos"

import planAprendizajeEsquema from "@src/api/esquemas/planAprendizaje.json"
import objetivoPlanAprendizajeEsquema from "@src/api/esquemas/objetivoPlanAprendizaje.json"

import { useEffect } from "react"
import { useContextoAutenticacion } from "@src/contexts/contextoAutentacion"
import { TablaAccionable } from "@src/components/VistaTablaAccionable"


export default function GestionarPlanDeAprendizaje() {

    const Elemento = (TablaAccionable<PlanDeAprendizaje, ObjetivoPlanAprendizaje>)
    const { docente } = useContextoAutenticacion()

    let esquemaPA = planAprendizajeEsquema
    let esquemaOPA = objetivoPlanAprendizajeEsquema
    let itemsPlanEvaluacionEsquematizados: Extendible = {}

    function esquematizarUCS() {
        listarUnidadesCurriculares().then(
            (response) => {
                let codigos: string[] = []
                let nombres: string[] = []
                response.data.map((uc) => {
                    codigos.push(uc.codigo)
                    nombres.push(uc.nombre);
                })
                esquemaPA.components.schemas.UCEnum.enum = codigos
                esquemaPA.components.schemas.UCEnum.enumNames = nombres
            }
        )
    }

    function esquematizarItemsPlanEvaluacion() {
        listarItemsPlanEvaluacion().then(
            (response) => {
                let ids: number[] = []
                let titulos: string[] = []
                let idPlanEvaluacion: number = 0

                response.data.map((ipe) => {
                    let instrumento = instrumentosEvaluacion[ipe.instrumento_evaluacion]
                    idPlanEvaluacion = ipe.plan_evaluacion
                    ids.push(ipe.id)
                    titulos.push(`${instrumento} ${ipe.peso}% (id: ${ipe.id})`);
                })

                itemsPlanEvaluacionEsquematizados[idPlanEvaluacion] = {
                    enum: ids,
                    enumNames: titulos
                }
            }
        )
    }

    useEffect(() => {
        esquematizarUCS()
        esquematizarItemsPlanEvaluacion()
    }, [])

    const obtenerEsquemaOPA = (pa?: PlanDeAprendizaje, _?: any) => {
        let codigoGrupo = pa?.codigo_grupo ?? ""
        let parametros: {enum: number[], enumNames: string[]} = itemsPlanEvaluacionEsquematizados[pa?.plan_evaluacion??0]
        esquemaOPA.properties.plan_aprendizaje.default = codigoGrupo
        esquemaOPA.components.schemas.EvaluacionAsociadaEnum = {
            type: "integer",
            nullable: true,
            ...parametros
        }
        return esquemaOPA
    }

    return (
        <Elemento
            contexto={{
                titulo: "Plan de Aprendizaje",
                plural: "Planes de Aprendizaje",
                subtitulo: "Objetivos de Plan de Aprendizaje"
            }}
            general={{
                campoIdentificadorObjeto: "codigo_grupo",
                metodoCrear: crearPlanAprendizaje,
                metodoListado: listarPlanesAprendizaje,
                formatearObjeto: (objeto: PlanDeAprendizaje) => {
                    let fechaModificacion = objeto.fecha_modificacion ?? 0
                    fechaModificacion = new Date(fechaModificacion).toLocaleString()
                    return {
                        ...objeto,
                        turno: turnos[objeto.turno],
                        nucleo: nucleos[objeto.nucleo],
                        fecha_modificacion: fechaModificacion
                    }
                }
            }}
            tabla={{
                itemsEncabezado: ["pnf", "turno", "nucleo", "docente", "unidad_curricular", "fecha_modificacion"],
                metodoActualizacion: actualizarPlanAprendizaje,
                metodoExportado: descargarPlanAprendizaje,
                metodoBorrado: eliminarPlanAprendizaje,
                obtenerNombreArchivo: (pa: PlanDeAprendizaje) => `Plan de Aprendizaje (${pa.codigo_grupo}).pdf`,
                subElementos: {
                    llave: "objetivos_plan_aprendizaje",
                    campos: ["id", "titulo", "duracion_horas", "evaluacion_asociada"],
                    anchoCampos: [1, 3, 1, 1],
                    relleno: 2,
                    campoIdentificador: "id",
                    metodoCrear: crearObjetivoPlanAprendizaje,
                    metodoActualizacion: actualizarObjetivoPlanAprendizaje,
                    metodoBorrado: eliminarObjetivoPlanAprendizaje
                }
            }}
            formulario={{
                esquema: {
                    obtenerEsquemaPrincipal: (..._) => esquemaPA,
                    obtenerEsquemaSubObjeto: obtenerEsquemaOPA
                },
                valoresPorDefecto: {
                    principal: {
                        'docente': docente?.cedula,
                        'fecha_creacion': new Date().toISOString(),
                        'fecha_modificacion': new Date().toISOString()
                    },
                    subObjeto: {
                        'estrategia_didactica': "CL",
                        'evaluacion_asociada': undefined
                    }
                }
            }}
        />
    )
}