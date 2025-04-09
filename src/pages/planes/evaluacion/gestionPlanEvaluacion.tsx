import {
    listarPlanesEvaluacion,
    crearPlanEvaluacion,
    actualizarPlanEvaluacion,
    eliminarPlanEvaluacion,
    crearItemPlanEvaluacion,
    actualizarItemPlanEvaluacion,
    eliminarItemPlanEvaluacion,
    descargarPlanEvaluacion
} from "@src/api/planesEvaluacion";

import { listarPlanesAprendizaje } from "@src/api/planesAprendizaje";

import {
    PlanDeEvaluacion,
    ItemPlanEvaluacion,
    instrumentosEvaluacion,
    tiposEvaluacion,
    pesos
} from "@src/api/tipos";

import planEvaluacionEsquema from "@src/api/esquemas/planEvaluacion.json";
import itemPlanEvaluacionEsquema from "@src/api/esquemas/itemPlanEvaluacion.json";

import { useEffect } from "react";
import { TablaAccionable } from "@src/components/VistaTablaAccionable";

/**
 * @file GestionarPlanDeEvaluacion.tsx
 * @description Componente funcional para la gestión de Planes de Evaluación y sus ítems.
 * Utiliza el componente genérico TablaAccionable para proporcionar una interfaz de usuario
 * para listar, crear, actualizar, eliminar y exportar Planes de Evaluación, así como
 * gestionar los ítems asociados a cada Plan.
 */
export default function GestionarPlanDeEvaluacion() {

    /**
     * @constant Elemento
     * @description Define el tipo específico del componente TablaAccionable para Planes de Evaluación
     * (PlanDeEvaluacion) como objeto principal e Ítems de Plan de Evaluación
     * (ItemPlanEvaluacion) como sub-objetos.
     */
    const Elemento = (TablaAccionable<PlanDeEvaluacion, ItemPlanEvaluacion>);

    /**
     * @constant {object} esquemaPE
     * @description Importa el esquema JSON para el formulario de Plan de Evaluación.
     */
    let esquemaPE = planEvaluacionEsquema;

    /**
     * @constant {object} esquemaIPE
     * @description Importa el esquema JSON para el formulario de Ítem de Plan de Evaluación.
     */
    let esquemaIPE = itemPlanEvaluacionEsquema;

    /**
     * @function esquematizarPAs
     * @description Realiza una llamada a la API para obtener la lista de Planes de Aprendizaje
     * y actualiza el esquema del formulario de Plan de Evaluación con las opciones
     * para el selector de Plan de Aprendizaje (código de grupo).
     * @async
     * @returns {void}
     */
    function esquematizarPAs() {
        listarPlanesAprendizaje().then(
            (response) => {
                const codigos: string[] = response.data.map((pa) => pa.codigo_grupo);
                esquemaPE.components.schemas.PAEnum.enum = codigos;
            }
        );
    }

    /**
     * @useEffect
     * @description Hook de efecto que se ejecuta una vez al montar el componente para
     * inicializar el esquema de Planes de Aprendizaje.
     * @dependency [] - Se ejecuta solo al inicio.
     */
    useEffect(() => {
        esquematizarPAs();
    }, []);

    /**
     * @function obtenerEsquemaIPE
     * @description Función que genera dinámicamente el esquema JSON para el formulario de
     * Ítem de Plan de Evaluación. Establece el valor por defecto del campo 'plan_evaluacion'
     * al ID del Plan de Evaluación seleccionado.
     * @param {PlanDeEvaluacion | undefined} pe - El Plan de Evaluación seleccionado (opcional).
     * @param {any} _ - Parámetro adicional no utilizado.
     * @returns {object} El esquema JSON para el formulario de Ítem de Plan de Evaluación.
     */
    const obtenerEsquemaIPE = (pe?: PlanDeEvaluacion, _?: any) => {
        const id = pe?.id as number;
        esquemaIPE.properties.plan_evaluacion.default = id;
        return esquemaIPE;
    };

    /**
     * @component Elemento
     * @description Renderiza el componente TablaAccionable configurado para la gestión de
     * Planes de Evaluación y sus Ítems. Proporciona la información de contexto,
     * configuración general, configuración de la tabla y configuración del formulario
     * necesarias para el funcionamiento del componente genérico.
     */
    return (
        <Elemento
            /**
             * @prop {object} contexto
             * @description Define el contexto de la entidad principal (Plan de Evaluación) y
             * su sub-entidad (Ítem de Plan de Evaluación) para la interfaz de usuario.
             */
            contexto={{
                titulo: "Plan de Evaluación",
                plural: "Planes de Evaluación",
                subtitulo: "Item de Plan de Evaluación"
            }}
            /**
             * @prop {object} general
             * @description Configuración general para la gestión de la entidad principal.
             */
            general={{
                campoIdentificadorObjeto: "id",
                metodoCrear: crearPlanEvaluacion,
                metodoListado: listarPlanesEvaluacion,
                formatearObjeto: (objeto: PlanDeEvaluacion) => {

                    let fechaModificacion: string | number = objeto.fecha_modificacion ?? 0;
                    fechaModificacion = new Date(fechaModificacion).toLocaleString();

                    let fechaCreacion: string | number = objeto.fecha_creacion ?? 0;
                    fechaCreacion = new Date(fechaCreacion).toLocaleString();

                    /**
                     * @constant {Array<object>} ItemsPlanEvaluacion
                     * @description Mapea los ítems del plan de evaluación para formatear los
                     * campos 'instrumento_evaluacion', 'tipo_evaluacion' y 'peso' utilizando
                     * los enums definidos en `@src/api/tipos`.
                     */
                    const ItemsPlanEvaluacion = objeto.items_plan_evaluacion.map(
                        (ipe) => ({
                            ...ipe,
                            instrumento_evaluacion: `${instrumentosEvaluacion[ipe.instrumento_evaluacion]} (#${ipe.id})`,
                            tipo_evaluacion: tiposEvaluacion[ipe.tipo_evaluacion],
                            peso: pesos[ipe.peso]
                        })
                    );
                    return {
                        ...objeto,
                        fecha_creacion: fechaCreacion,
                        fecha_modificacion: fechaModificacion,
                        items_plan_evaluacion: ItemsPlanEvaluacion
                    };
                }
            }}
            /**
             * @prop {object} tabla
             * @description Configuración específica para la visualización y las acciones de la tabla
             * de la entidad principal.
             */
            tabla={{
                itemsEncabezado: ["plan_aprendizaje", "nombre", "peso_total_actual", "fecha_modificacion"],
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
            /**
             * @prop {object} formulario
             * @description Configuración para la generación dinámica de los formularios de creación
             * y edición tanto para la entidad principal como para la sub-entidad.
             */
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
    );
}