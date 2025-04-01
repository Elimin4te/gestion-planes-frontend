import TablaDinamicaExpandible from '@src/components/TablaDinamica'
import { useState, useEffect, useRef } from 'react'

import { listarPlanesAprendizaje, descargarPlanAprendizaje, eliminarPlanAprendizaje } from '@src/api/gestionPlanes'
import { formatearObjeto } from '@src/api/common'
import { obtenerPrimerValor } from '@src/utils'
import { PlanDeAprendizaje, ObjetivoPlanAprendizaje, nucleos, estrategiasDidacticas, turnos } from '@src/api/tipos'

import { Flex, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogFooter, AlertDialogContent, AlertDialogBody, AlertDialogHeader, Button, Icon, HStack, Text } from '@chakra-ui/react'
import { BiErrorCircle, BiPlusCircle, BiRefresh } from 'react-icons/bi';
import { random } from 'lodash'

export default function ListadoPlanesAprendizaje() {

    // Utilizado para asignar tipo
    let vacio: PlanDeAprendizaje[] = []

    const [planes, setPlanes] = useState(vacio)
    const [errorAccion, setErrorAccion] = useState()
    const [id, refrescar] = useState()

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
        planAprendizaje.objetivosPlanAprendizaje = planAprendizaje.objetivosPlanAprendizaje.sort((a, b) => a.id > b.id)
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

    const borrarPlanAprendizaje = (dato: PlanDeAprendizaje) => {
        eliminarPlanAprendizaje(dato.codigoGrupo).then().catch(
            (err) => { setErrorAccion(obtenerPrimerValor(err.response.data)); onOpenError() }
        )
        obtenerPlanesAprendizaje()
    }

    useEffect(() => {
        obtenerPlanesAprendizaje()
    }, [id])

    return (
        <Flex direction='column' w='100%'>
            <Flex mb={'2dvh'}>
                <Button leftIcon={<BiPlusCircle/>} colorScheme='green' mr={'2dvh'}>
                    Agregar Plan
                </Button>
                <Button leftIcon={<BiRefresh/>} colorScheme='blue' onClick={() => refrescar(random())}>
                    Refrescar Planes
                </Button>
            </Flex>
            {errorAccion ? (
                <AlertDialog
                    isOpen={isOpenError}
                    leastDestructiveRef={okRef}
                    onClose={onCloseError}
                    isCentered={true}
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
            {planes.length > 0 ? 
            <TablaDinamicaExpandible
                encabezado={['pnf', 'turno', 'nucleo', 'docente', 'unidadCurricular', 'fechaModificacion']}
                datos={planes}
                llaveSubElemento='objetivosPlanAprendizaje'
                camposSubElementos={['id', 'titulo', 'duracionHoras', 'evaluacionAsociada']}
                anchosSubElementos={[1, 3, 1, 1]}
                accionExportar={exportarPlanAprendizaje}
                accionEditar={() => null}
                accionEliminar={borrarPlanAprendizaje}
            />
            : <Text fontSize='2dvh' textAlign={'center'} marginTop={'auto'} marginBottom={'auto'}>No hay planes para mostrar por los momentos.</Text>}
        </Flex>
    )
}