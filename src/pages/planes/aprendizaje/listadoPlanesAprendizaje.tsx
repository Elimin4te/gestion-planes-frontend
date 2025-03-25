import TablaDinamica from '@src/components/TablaDinamica'
import { useState, useEffect } from 'react'

import { listarPlanesAprendizaje } from '@src/api/gestionPlanes'
import { formatearObjeto } from '@src/api/common'
import { PlanDeAprendizaje, ObjetivoPlanAprendizaje, nucleos, estrategiasDidacticas, turnos } from '@src/api/tipos'

export default function ListadoPlanesAprendizaje() {

    // Utilizado para asignar tipo
    let vacio: PlanDeAprendizaje[] = []

    const [ planes, setPlanes ] = useState(vacio)

    const formatearPlanAprendizaje = (pa: object): PlanDeAprendizaje => {
        let planAprendizaje: PlanDeAprendizaje = formatearObjeto(pa)
        planAprendizaje.objetivosPlanAprendizaje = planAprendizaje.objetivosPlanAprendizaje.map(
            (opa) => {
                let objetivo: ObjetivoPlanAprendizaje = formatearObjeto(opa)
                objetivo.estrategiaDidactica = estrategiasDidacticas[objetivo.estrategiaDidactica]
                return objetivo
            }
        )
        planAprendizaje.nucleo = nucleos[planAprendizaje.nucleo]
        planAprendizaje.turno = turnos[planAprendizaje.turno]
        planAprendizaje.fechaCreacion = new Date(planAprendizaje.fechaCreacion).toLocaleString()
        planAprendizaje.fechaModificacion = new Date(planAprendizaje.fechaModificacion).toLocaleString()

        return planAprendizaje
    }

    const obtenerPlanesAprendizaje = () => {
        listarPlanesAprendizaje().then(
            (response) => setPlanes(response.data.map((obj: any) => formatearPlanAprendizaje(obj)))
        )
    }

    useEffect(() => {
        obtenerPlanesAprendizaje()
    }, [])

    return (
        <TablaDinamica 
            encabezado={['pnf', 'turno', 'nucleo', 'docente', 'unidadCurricular', 'fechaModificacion']}
            datos={planes}
        />
    )
}