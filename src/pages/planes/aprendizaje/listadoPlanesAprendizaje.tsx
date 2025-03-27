import TablaDinamica from '@src/components/TablaDinamica'
import { useState, useEffect, useRef } from 'react'

import { listarPlanesAprendizaje, descargarPlanAprendizaje } from '@src/api/gestionPlanes'
import { formatearObjeto } from '@src/api/common'
import { obtenerPrimerValor } from '@src/utils'
import { PlanDeAprendizaje, ObjetivoPlanAprendizaje, nucleos, estrategiasDidacticas, turnos } from '@src/api/tipos'

import { Flex, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogFooter, AlertDialogContent, AlertDialogBody, AlertDialogHeader, Button, Icon, HStack, Text } from '@chakra-ui/react'
import { BiErrorCircle } from 'react-icons/bi';

export default function ListadoPlanesAprendizaje() {

    // Utilizado para asignar tipo
    let vacio: PlanDeAprendizaje[] = []

    const [planes, setPlanes] = useState(vacio)
    const [errorAccion, setErrorAccion] = useState()

    const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure()
    const okRef = useRef()

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

    const exportarPlanAprendizaje = (dato: PlanDeAprendizaje) => {
        descargarPlanAprendizaje(dato.codigoGrupo).then().catch(
            (err) => { setErrorAccion(obtenerPrimerValor(err.response.data)); onOpenError() }
        )
    }

    const eliminarPlanAprendizaje = (dato: PlanDeAprendizaje) => {
        // descargarPlanAprendizaje(dato.codigoGrupo).then().catch(
        //     (err) => { setErrorAccion(obtenerPrimerValor(err.response.data)); onOpenError() }
        // )
        obtenerPlanesAprendizaje()
    }

    useEffect(() => {
        obtenerPlanesAprendizaje()
    }, [])

    return (
        <Flex direction='column' w='100%'>
            {errorAccion ? (
                <AlertDialog
                    isOpen={isOpenError}
                    leastDestructiveRef={okRef}
                    onClose={onCloseError}
                >
                    <AlertDialogOverlay />
                    <AlertDialogContent>

                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            <HStack>
                                <Icon as={BiErrorCircle} color='red.500' h='3vh' w='3vh' />
                                <Text>Ups...</Text>
                            </HStack>
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {errorAccion}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={okRef} onClick={onCloseError}>
                                Ok
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            ) : null}
            <TablaDinamica
                encabezado={['pnf', 'turno', 'nucleo', 'docente', 'unidadCurricular', 'fechaModificacion']}
                datos={planes}
                accionExportar={exportarPlanAprendizaje}
                accionEditar={() => null}
                accionEliminar={eliminarPlanAprendizaje}
            />
        </Flex>
    )
}