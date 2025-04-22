import {
    listarPlanesAprendizaje,
    crearPlanAprendizaje,
    descargarPlanAprendizaje,
    eliminarPlanAprendizaje,
    actualizarPlanAprendizaje,
    crearObjetivoPlanAprendizaje,
    actualizarObjetivoPlanAprendizaje,
    eliminarObjetivoPlanAprendizaje
} from "@src/api/planesAprendizaje";

import { listarItemsPlanEvaluacion } from "@src/api/planesEvaluacion";

import { listarUnidadesCurriculares } from "@src/api/unidadesCurriculares";

import {
    PlanDeAprendizaje,
    ObjetivoPlanAprendizaje,
    turnos,
    nucleos,
    Extendible,
    instrumentosEvaluacion
} from "@src/api/tipos";

import planAprendizajeEsquema from "@src/api/esquemas/planAprendizaje.json";
import objetivoPlanAprendizajeEsquema from "@src/api/esquemas/objetivoPlanAprendizaje.json";

import { useEffect } from "react";
import { useContextoAutenticacion } from "@src/contexts/contextoAutentacion";
import { TablaAccionable } from "@src/components/VistaTablaAccionable";

/**
 * @file GestionarPlanDeAprendizaje.tsx
 * @description Componente funcional para la gestión de Planes de Aprendizaje y sus objetivos.
 * Utiliza el componente genérico TablaAccionable para proporcionar una interfaz de usuario
 * para listar, crear, actualizar, eliminar y exportar Planes de Aprendizaje, así como
 * gestionar los Objetivos asociados a cada Plan.
 */
export default function GestionarPlanDeAprendizaje() {

    /**
     * @constant Elemento
     * @description Define el tipo específico del componente TablaAccionable para Planes de Aprendizaje
     * (PlanDeAprendizaje) como objeto principal y Objetivos de Plan de Aprendizaje
     * (ObjetivoPlanAprendizaje) como sub-objetos.
     */
    const Elemento = (TablaAccionable<PlanDeAprendizaje, ObjetivoPlanAprendizaje>);

    /**
     * @constant {object} authContext
     * @description Obtiene el contexto de autenticación para acceder a la información del docente logueado.
     */
    const { docente } = useContextoAutenticacion();

    /**
     * @constant {object} esquemaPA
     * @description Importa el esquema JSON para el formulario de Plan de Aprendizaje.
     */
    let esquemaPA = planAprendizajeEsquema;

    /**
     * @constant {object} esquemaOPA
     * @description Importa el esquema JSON para el formulario de Objetivo de Plan de Aprendizaje.
     */
    let esquemaOPA = objetivoPlanAprendizajeEsquema;

    /**
     * @constant {object} itemsPlanEvaluacionEsquematizados
     * @description Objeto para almacenar la información esquematizada de los ítems del plan de evaluación,
     * indexado por el ID del plan de evaluación. Se utiliza para generar las opciones del
     * selector de evaluación asociada en el formulario de objetivos.
     */
    let itemsPlanEvaluacionEsquematizados: Extendible = {};

    /**
     * @function esquematizarUCS
     * @description Realiza una llamada a la API para obtener la lista de Unidades Curriculares
     * y actualiza el esquema del formulario de Plan de Aprendizaje con las opciones
     * para el selector de Unidad Curricular (código y nombre).
     * @async
     * @returns {void}
     */
    function esquematizarUCS() {
        listarUnidadesCurriculares().then(
            (response) => {
                const codigos: string[] = [];
                const nombres: string[] = [];
                response.data.forEach((uc) => {
                    codigos.push(uc.codigo);
                    nombres.push(uc.nombre);
                });
                esquemaPA.components.schemas.UCEnum.enum = codigos;
                esquemaPA.components.schemas.UCEnum.enumNames = nombres;
            }
        );
    }

    /**
     * @function esquematizarItemsPlanEvaluacion
     * @description Realiza una llamada a la API para obtener la lista de ítems del plan de evaluación
     * y los esquematiza por el ID del plan de evaluación. Esta información se utiliza para
     * generar las opciones del selector de "evaluación asociada" en el formulario de objetivos.
     * @async
     * @returns {void}
     */
    function esquematizarItemsPlanEvaluacion() {
        listarItemsPlanEvaluacion().then(
            (response) => {
                const planesEvaluacion = new Set(response.data.map((ipe) => ipe.plan_evaluacion));
                planesEvaluacion.forEach((pe) => {
                    const ids: number[] = [];
                    const titulos: string[] = [];
                    response.data.filter(
                        (ipe) => ipe.plan_evaluacion === pe
                    ).forEach((ipe) => {
                        ids.push(ipe.id);
                        titulos.push(
                            `${instrumentosEvaluacion[ipe.instrumento_evaluacion]} ${ipe.peso}% (#${ipe.id})`
                        );
                    });
                    itemsPlanEvaluacionEsquematizados[pe] = {
                        enum: ids,
                        enumNames: titulos
                    };
                });
            }
        );
    }

    /**
     * @useEffect
     * @description Hook de efecto que se ejecuta una vez al montar el componente para
     * inicializar los esquemas de Unidades Curriculares e Ítems del Plan de Evaluación.
     * @dependency [] - Se ejecuta solo al inicio.
     */
    useEffect(() => {
        esquematizarUCS();
        esquematizarItemsPlanEvaluacion();
    }, []);

    /**
     * @function obtenerEsquemaOPA
     * @description Función que genera dinámicamente el esquema JSON para el formulario de
     * Objetivo de Plan de Aprendizaje. Establece el valor por defecto del campo 'plan_aprendizaje'
     * y configura las opciones del selector de 'evaluacion_asociada' basándose en los
     * ítems del plan de evaluación asociados al Plan de Aprendizaje seleccionado.
     * @param {PlanDeAprendizaje | undefined} pa - El Plan de Aprendizaje seleccionado (opcional).
     * @param {any} _ - Parámetro adicional no utilizado.
     * @returns {object} El esquema JSON para el formulario de Objetivo de Plan de Aprendizaje.
     */
    const obtenerEsquemaOPA = (pa?: PlanDeAprendizaje, _?: any) => {
        const codigoGrupo = pa?.codigo_grupo ?? "";
        let parametros: { enum: number[], enumNames: string[] } = itemsPlanEvaluacionEsquematizados[pa?.plan_evaluacion ?? 0];
        parametros = parametros ?? {
            enum: [null],
            enumNames: ["N/A"],
        };
        esquemaOPA.properties.plan_aprendizaje.default = codigoGrupo;
        esquemaOPA.components.schemas.EvaluacionAsociadaEnum = {
            type: "integer",
            nullable: true,
            ...parametros
        };
        return esquemaOPA;
    };

    /**
     * @component Elemento
     * @description Renderiza el componente TablaAccionable configurado para la gestión de
     * Planes de Aprendizaje y sus Objetivos. Proporciona la información de contexto,
     * configuración general, configuración de la tabla y configuración del formulario
     * necesarias para el funcionamiento del componente genérico.
     */
    return (
        <Elemento
            /**
             * @prop {object} contexto
             * @description Define el contexto de la entidad principal (Plan de Aprendizaje) y
             * su sub-entidad (Objetivo de Plan de Aprendizaje) para la interfaz de usuario.
             */
            contexto={{
                titulo: "Plan de Aprendizaje",
                plural: "Planes de Aprendizaje",
                subtitulo: "Objetivo de Plan de Aprendizaje"
            }}
            /**
             * @prop {object} general
             * @description Configuración general para la gestión de la entidad principal.
             */
            general={{
                campoIdentificadorObjeto: "codigo_grupo",
                metodoCrear: crearPlanAprendizaje,
                metodoListado: listarPlanesAprendizaje,
                formatearObjeto: (objeto: PlanDeAprendizaje) => {
                    let fechaModificacion: string | number = objeto.fecha_modificacion ?? 0;
                    fechaModificacion = new Date(fechaModificacion).toLocaleString();
                    return {
                        ...objeto,
                        turno: turnos[objeto.turno],
                        nucleo: nucleos[objeto.nucleo],
                        fecha_modificacion: fechaModificacion
                    };
                }
            }}
            /**
             * @prop {object} tabla
             * @description Configuración específica para la visualización y las acciones de la tabla
             * de la entidad principal.
             */
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
            /**
             * @prop {object} formulario
             * @description Configuración para la generación dinámica de los formularios de creación
             * y edición tanto para la entidad principal como para la sub-entidad.
             */
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
    );
}