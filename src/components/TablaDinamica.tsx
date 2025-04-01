import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Icon,
    AlertDialog, AlertDialogOverlay, AlertDialogFooter, AlertDialogContent, AlertDialogBody, AlertDialogHeader, useDisclosure,
    HStack,
    Button,
    Text,
    Flex,

} from '@chakra-ui/react';

import { AiFillEdit, AiFillDelete, AiOutlineExport, AiFillPlusCircle, AiOutlineDown, AiOutlineUp} from 'react-icons/ai';
import { BiErrorCircle } from 'react-icons/bi';

import _ from 'lodash'
import { ElementType, useRef, useState } from 'react';

const BotonDeAccion = (props: { icono: ElementType, color: string, accion?: (...args: any) => void }) => {
    let { icono, color, accion } = props
    return (
        <Icon w='100%' color={color} as={icono} h='2vh' _hover={{ cursor: 'pointer', h: '2.2vh' }} onClick={accion} />
    )
}

const TablaDinamicaExpandible = (
    props: {
        encabezado: string[],
        datos: object[],
        llaveSubElemento: string,
        camposSubElementos: string[],
        anchosSubElementos: number[],
        accionExportar: (...args: any) => void,
        accionEditar: (...args: any) => void,
        accionAggItem: (...args: any) => void,
        accionEliminar: (...args: any) => void
    }) => {
    let { encabezado, datos, llaveSubElemento, camposSubElementos, anchosSubElementos, accionExportar, accionEditar, accionAggItem, accionEliminar } = props
    const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure()
    const cerrarRef = useRef()
    const [elementoSeleccionado, seleccionarElemento] = useState(null)
    const [elementoExpandido, expandirElemento] = useState(null)
    const rellenoSubElementos: null[] = Array(encabezado.length - camposSubElementos.length).fill(null);

    function abrirAlertaBorrado(elemento: any) {
        seleccionarElemento(elemento)
        onOpenAlert()
    }

    return (
        <>
            <AlertDialog
                isOpen={isOpenAlert}
                leastDestructiveRef={cerrarRef}
                onClose={onCloseAlert}
                isCentered={true}
            >
                <AlertDialogOverlay />
                <AlertDialogContent>

                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        <HStack>
                            <Icon as={BiErrorCircle} color='orange.500' h='3vh' w='3vh' />
                            <Text>Advertencia</Text>
                        </HStack>
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Al eliminar el registro, se eliminaran todos los registros asociados a el y no podrán ser recuperados ¿Estás Seguro?
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cerrarRef} onClick={onCloseAlert} mr='10px'>
                            Cancelar
                        </Button>
                        <Button onClick={() => { accionEliminar(elementoSeleccionado); onCloseAlert() }} colorScheme={'orange'}>
                            Eliminar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <TableContainer w='100%'>
                <Table variant="simple">
                    <Thead textAlign='center'>
                        <Tr>
                            <Th colSpan={1}>&nbsp;&nbsp;</Th>
                            {encabezado.map((header) => (
                                <Th key={header}>{_.startCase(header)}</Th>
                            ))}
                            <Th colSpan={1} textAlign='center'>Exportar</Th>
                            <Th colSpan={1} textAlign='center'>Editar</Th>
                            <Th colSpan={1} textAlign='center'>Crear Item</Th>
                            <Th colSpan={1} textAlign='center'>Eliminar</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {datos.map((dato, idx) => (
                            <>
                                <Tr key={idx} backgroundColor='#1a202cc7'>
                                    <Td>{
                                    elementoExpandido !== idx ? 
                                        <BotonDeAccion icono={AiOutlineDown} accion={() => expandirElemento(idx)} color='yellow.100'/>
                                    :   <BotonDeAccion icono={AiOutlineUp} accion={() => expandirElemento(null)} color='yellow.100'/>
                                    }</Td>
                                    {encabezado.map((header) => (
                                        <Td key={`${idx}-${header}`}>{dato[header]}</Td>
                                    ))}
                                    <Td><BotonDeAccion icono={AiOutlineExport} accion={() => accionExportar(dato)} color='blue.500' /></Td>
                                    <Td><BotonDeAccion icono={AiFillEdit} accion={() => accionEditar(dato)} color='yellow.500' /></Td>
                                    <Td><BotonDeAccion icono={AiFillPlusCircle} accion={() => accionAggItem(dato)} color='green.500' /></Td>
                                    <Td><BotonDeAccion icono={AiFillDelete} accion={() => abrirAlertaBorrado(dato)} color='red.500' /></Td>
                                </Tr>
                                
                                {elementoExpandido === idx ?
                                    <>
                                    <Tr backgroundColor={'black'}>
                                        <Td colSpan={encabezado.length + 5}>
                                            <Flex>
                                                <Text textAlign={'center'} w={'100%'}>
                                                    {`${dato[llaveSubElemento].length} ${_.startCase(llaveSubElemento)}`}
                                                </Text>
                                            </Flex>
                                        </Td>
                                    </Tr>
                                    {dato[llaveSubElemento].map((subdato, subidx) => (
                                        <Tr>
                                            <Td colSpan={1}>
                                                <Text as='b' ml='2dvh'>{'->'}</Text>
                                            </Td>
                                            {camposSubElementos.map((campo, idxcampo) => (
                                                <Td 
                                                    key={subidx} colSpan={anchosSubElementos[idxcampo]} 
                                                    overflow='hidden'
                                                    white-space='nowrap'
                                                    text-overflow='ellipsis'
                                                >
                                                    <Flex w='100%'>
                                                        {_.startCase(campo)}:  
                                                        <Text as='b'>&nbsp;{subdato[campo]??'N/A'}</Text>
                                                    </Flex>
                                                </Td>
                                            ))}
                                            <Td colSpan={1}>
                                                <BotonDeAccion icono={AiFillEdit} accion={() => {}} color='yellow.200'/>
                                            </Td>  
                                            <Td colSpan={1}>
                                                <BotonDeAccion icono={AiFillDelete} accion={() => {}} color='red.200'/> 
                                            </Td>
                                            {rellenoSubElementos.map(() => <Td></Td>)}                         
                                        </Tr>
                                    ))}
                                    </>
                                : null}
                            </>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </>

    );
};

export default TablaDinamicaExpandible;