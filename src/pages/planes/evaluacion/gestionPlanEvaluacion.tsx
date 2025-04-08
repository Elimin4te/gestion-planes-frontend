import {
    listarPlanesEvaluacion,
    crearPlanEvaluacion,
    actualizarPlanEvaluacion,
    eliminarPlanEvaluacion,
    crearItemPlanEvaluacion,
    actualizarItemPlanEvaluacion,
    eliminarItemPlanEvaluacion,
    descargarPlanEvaluacion
} from "@src/api/planesEvaluacion"

import { listarPlanesAprendizaje } from "@src/api/planesAprendizaje"

import {
    PlanDeEvaluacion,
    ItemPlanEvaluacion,
    instrumentosEvaluacion,
    tiposEvaluacion,
    pesos
} from "@src/api/tipos"

import planEvaluacionEsquema from "@src/api/esquemas/planEvaluacion.json"
import itemPlanEvaluacionEsquema from "@src/api/esquemas/itemPlanEvaluacion.json"

import { useEffect } from "react"
import { TablaAccionable } from "@src/components/VistaTablaAccionable"


export default function GestionarPlanDeEvaluacion() {

    const Elemento = (TablaAccionable<PlanDeEvaluacion, ItemPlanEvaluacion>)

    let esquemaPE = planEvaluacionEsquema
    let esquemaIPE = itemPlanEvaluacionEsquema

    function esquematizarPAs() {
        listarPlanesAprendizaje().then(
            (response) => {
                let codigos: string[] = response.data.map((pa) => pa.codigo_grupo)
                esquemaPE.components.schemas.PAEnum.enum = codigos
            }
        )
    }

    useEffect(() => {
        esquematizarPAs()
    }, [])

    const obtenerEsquemaIPE = (pe?: PlanDeEvaluacion, _?: any) => {
        let id = pe?.id as number
        esquemaIPE.properties.plan_evaluacion.default = id
        return esquemaIPE
    }

    return (
        <Elemento
            contexto={{
                titulo: "Plan de Evaliuación",
                plural: "Planes de Evaluación",
                subtitulo: "Items de Plan de Evaluación"
            }}
            general={{
                campoIdentificadorObjeto: "id",
                metodoCrear: crearPlanEvaluacion,
                metodoListado: listarPlanesEvaluacion,
                formatearObjeto: (objeto: PlanDeEvaluacion) => {

                    let fechaModificacion = objeto.fecha_modificacion ?? 0
                    fechaModificacion = new Date(fechaModificacion).toLocaleString()

                    let fechaCreacion = objeto.fecha_creacion ?? 0
                    fechaCreacion = new Date(fechaCreacion).toLocaleString()
                    
                    let ItemsPlanEvaluacion = objeto.items_plan_evaluacion.map(
                        (ipe) => ({
                            ...ipe,
                            instrumento_evaluacion: `${instrumentosEvaluacion[ipe.instrumento_evaluacion]} (#${ipe.id})`,
                            tipo_evaluacion: tiposEvaluacion[ipe.tipo_evaluacion],
                            peso: pesos[ipe.peso]
                        })
                    )
                    return {
                        ...objeto,
                        fecha_creacion: fechaCreacion,
                        fecha_modificacion: fechaModificacion,
                        items_plan_evaluacion: ItemsPlanEvaluacion
                    }
                }
            }}
            tabla={{
                itemsEncabezado: ["plan_aprendizaje", "nombre", "fecha_creacion", "fecha_modificacion"],
                metodoActualizacion: actualizarPlanEvaluacion,
                metodoExportado: descargarPlanEvaluacion,
                metodoBorrado: eliminarPlanEvaluacion,
                obtenerNombreArchivo: (pe: PlanDeEvaluacion) => `Plan de Evaluación (${pe.plan_aprendizaje}).pdf`,
                subElementos: {
                    llave: "items_plan_evaluacion",
                    campos: ["instrumento_evaluacion", "tipo_evaluacion", "peso"],
                    anchoCampos: [2, 1, 1],
                    relleno: 2,
                    campoIdentificador: "id",
                    metodoCrear: crearItemPlanEvaluacion,
                    metodoActualizacion: actualizarItemPlanEvaluacion,
                    metodoBorrado: eliminarItemPlanEvaluacion
                }
            }}
            formulario={{
                esquema: {
                    obtenerEsquemaPrincipal: (..._) => esquemaPE,
                    obtenerEsquemaSubObjeto: obtenerEsquemaIPE
                },
                valoresPorDefecto: {
                    principal: {
                        'fecha_creacion': new Date().toISOString(),
                        'fecha_modificacion': new Date().toISOString()
                    },
                    subObjeto: {
                        'tipo_evaluacion': "SU",
                        'peso': 15
                    }
                }
            }}
        />
    )
}