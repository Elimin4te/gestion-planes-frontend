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
    Text
} from '@chakra-ui/react';

import { AiFillEdit, AiFillDelete, AiOutlineExport } from 'react-icons/ai';
import { BiErrorCircle } from 'react-icons/bi';

import _ from 'lodash'
import { ElementType, useRef } from 'react';

const BotonDeAccion = (props: { icono: ElementType, color: string, accion?: (...args: any) => void }) => {
    let { icono, color, accion } = props
    return (
        <Icon w='100%' color={color} as={icono} h='2vh' _hover={{ cursor: 'pointer', h: '2.2vh' }} onClick={accion} />
    )
}

const TablaDinamica = (
    props: {
        encabezado: string[],
        datos: object[],
        accionExportar: (...args: any) => void,
        accionEditar: (...args: any) => void,
        accionEliminar: (...args: any) => void
    }) => {
    let { encabezado, datos, accionExportar, accionEditar, accionEliminar } = props
    const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure()
    const cerrarRef = useRef()

    return (
        <>
            <AlertDialog
                isOpen={isOpenAlert}
                leastDestructiveRef={cerrarRef}
                onClose={onCloseAlert}
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
                        <Button onClick={() => { accionEliminar(); onCloseAlert() }} colorScheme={'orange'}>
                            Eliminar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <TableContainer w='100%'>
                <Table variant="simple">
                    <Thead textAlign='center'>
                        <Tr>
                            {encabezado.map((header) => (
                                <Th key={header}>{_.startCase(header)}</Th>
                            ))}
                            <Th colSpan={1} textAlign='center'>Exportar</Th>
                            <Th colSpan={1} textAlign='center'>Editar</Th>
                            <Th colSpan={1} textAlign='center'>Eliminar</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {datos.map((dato, idx) => (
                            <Tr key={idx}>
                                {encabezado.map((header) => (
                                    <Td key={`${idx}-${header}`}>{dato[header]}</Td>
                                ))}
                                <Td><BotonDeAccion icono={AiOutlineExport} accion={() => accionExportar(dato)} color='blue.500' /></Td>
                                <Td><BotonDeAccion icono={AiFillEdit} accion={() => accionEditar(dato)} color='yellow.500' /></Td>
                                <Td><BotonDeAccion icono={AiFillDelete} accion={onOpenAlert} color='red.500' /></Td>
                            </Tr>
                        ))}

                    </Tbody>
                </Table>
            </TableContainer>
        </>

    );
};

export default TablaDinamica;