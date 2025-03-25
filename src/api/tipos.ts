export const estrategiasDidacticas = {
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

export const instrumentoEvaluacion = {
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

export const nucleos = {
    FLO: 'La Floresta',
    URB: 'La Urbina',
    ALT: 'Altagracia',
    LGA: 'La Guaira'
}

export const pesos = {
    5: '5%',
    10: '10%',
    15: '15%',
    20: '20%',
    25: '25%'
};

export const tiposEvaluacion = {
    DI: 'Diagnóstica',
    FO: 'Formativa',
    SU: 'Sumativa',
    AU: 'Autoevaluación',
    CO: 'Coevaluación'
};

export const trayectos = {
    0: 'Inicial',
    1: '1',
    2: '2',
    3: '3',
    4: '4'
};

export const turnos = {
    N: 'Nocturno',
    V: 'Vespertino',
    M: 'Matutino',
    S: 'Sabatino'
};

export type ObjetivoPlanAprendizaje = {
    id: BigInteger,
    titulo: string,
    contenido: string,
    criterioLogro: string,
    estrategiaDidactica: string,
    duracionHoras: BigInteger,
    planAprendizaje: string,
    evaluacionAsociada: BigInteger
}

export type PlanDeAprendizaje = {
    codigoGrupo: string,
    docente: string,
    unidadCurricular: string,
    nucleo: string,
    turno: string,
    pnf: string,
    fechaCreacion: Date | string,
    fechaModificacion: Date | string,
    objetivosPlanAprendizaje: ObjetivoPlanAprendizaje[]
}