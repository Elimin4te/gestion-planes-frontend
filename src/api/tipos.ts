export type Primario = string | number | any

export type Extendible = { [attr: string]: Primario }

export const estrategiasDidacticas: Extendible = {
    CL: 'Clase magistral',
    TR: 'Trabajo en grupo',
    DE: 'Debate',
    EP: 'Estudio de caso',
    AP: 'Aprendizaje basado en problemas',
    PY: 'Proyecto',
    TA: 'Taller',
    LB: 'Laboratorio',
    EX: 'Exposición',
    SE: 'Seminario',
    TI: 'Tutoría individual',
    TC: 'Tutoría colectiva',
    VA: 'Visita guiada',
    PC: 'Práctica de campo',
    EV: 'Evaluación',
    OT: 'Otras'
};

export const instrumentosEvaluacion: Extendible = {
    PR: 'Prueba escrita (objetiva)',
    PE: 'Prueba escrita (ensayo)',
    PO: 'Prueba oral',
    TR: 'Trabajo escrito',
    TA: 'Tarea',
    EX: 'Exposición oral',
    PY: 'Proyecto',
    IN: 'Informe',
    PC: 'Participación en clase',
    AC: 'Actividades colaborativas',
    DE: 'Debate',
    SE: 'Seminario',
    CT: 'Control de lectura',
    CV: 'Cuestionario',
    DI: 'Diario reflexivo',
    CA: 'Carpeta de trabajos',
    AU: 'Autoevaluación',
    CO: 'Coevaluación',
    OT: 'Otras'
};

export const nucleos: Extendible = {
    FLO: 'La Floresta',
    URB: 'La Urbina',
    ALT: 'Altagracia',
    LGA: 'La Guaira'
}

export const pesos: Extendible = {
    5: '5%',
    10: '10%',
    15: '15%',
    20: '20%',
    25: '25%'
};

export const tiposEvaluacion: Extendible = {
    DI: 'Diagnóstica',
    FO: 'Formativa',
    SU: 'Sumativa',
    AU: 'Autoevaluación',
    CO: 'Coevaluación'
};

export const trayectos: Extendible = {
    0: 'Inicial',
    1: '1',
    2: '2',
    3: '3',
    4: '4'
};

export const turnos: Extendible = {
    N: 'Nocturno',
    V: 'Vespertino',
    M: 'Matutino',
    S: 'Sabatino',
};

export type ErrorAPI = {
    [attr: string]: string[]
}

export type ObjetivoPlanAprendizaje = {
    id: number;
    titulo: string;
    contenido: string;
    criterio_logro: string;
    estrategia_didactica: string;
    duracion_horas: number;
    plan_aprendizaje: string;
    evaluacion_asociada: number;
};

export type PlanDeAprendizaje = {
    codigo_grupo: string;
    docente: string;
    unidad_curricular: string;
    nucleo: string;
    turno: string;
    pnf: string;
    fecha_creacion?: string;
    fecha_modificacion?: string;
    plan_evaluacion?: number;
    objetivos_plan_aprendizaje?: ObjetivoPlanAprendizaje[];
};

export type PlanDeEvaluacion = {
    id: number;
    plan_aprendizaje: string;
    items_plan_evaluacion: ItemPlanEvaluacion[];
    nombre: string;
    fecha_creacion: string; // Formato $date-time
    fecha_modificacion?: string | null; // Formato $date-time, nullable
};

export type ItemPlanEvaluacion = {
    id: number;
    objetivos: ObjetivoPlanAprendizaje[];
    instrumento_evaluacion: string;
    tipo_evaluacion: string;
    habilidades_a_evaluar: string;
    peso: number;
    fecha_planificada: string; // Formato $date
    plan_evaluacion: number;
};

export enum SemestreEnum {
    NA = 'NA', // No Aplica
    Uno = '1',
    Dos = '2',
}

export interface UnidadCurricular {
    codigo: string;
    trayecto: 0 | 1 | 2 | 3 | 4;
    semestre: SemestreEnum;
    unidades_credito: number;
    nombre: string;
}