import { ElementType, Fragment, useState, useEffect, useRef } from 'react';
import { random, startCase } from 'lodash';
import { AxiosError, AxiosResponse } from 'axios';
import {
    Flex,
    HStack,
    Text,
    Button,
    Icon,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useDisclosure,
} from '@chakra-ui/react';
import {
    AiFillEdit,
    AiFillDelete,
    AiOutlineExport,
    AiFillPlusCircle,
    AiOutlineDown,
    AiOutlineUp,
} from 'react-icons/ai';
import { BiErrorCircle, BiPlusCircle, BiRefresh } from 'react-icons/bi';

import { AlertaModal, AlertaAccion } from './Alerta';

import { obtenerPrimerValor } from '@src/utils';
import {
    ErrorAPI,
    Extendible
} from '@src/api/tipos';

import FormularioModalDinamico from './FormularioDinamico';

export interface TablaAccionableProps<T, ST> {
    contexto: {
        titulo: string,
        plural: string,
        subtitulo: string
    },
    general: {
        campoIdentificadorObjeto: string | number
        formatearObjeto?: (objeto: T) => T
        metodoCrear: (objeto: T) => Promise<AxiosResponse<T, any>>
        metodoListado: () => Promise<AxiosResponse<T[], any>>
    }
    tabla: {
        metodoActualizacion: (identificador: string | number, datos: Extendible) => Promise<AxiosResponse<T, any>>
        metodoExportado: (identificador: string | number) => Promise<AxiosResponse<any, any>>
        metodoBorrado: (identificador: string | number) => Promise<AxiosResponse<any, any>>
        obtenerNombreArchivo: (objeto: T) => string
        itemsEncabezado: string[],
        subElementos: {
            llave: string,
            campos: string[]
            campoIdentificador: string | number
            anchoCampos: number[]
            relleno: number
            metodoCrear: (objeto: ST) => Promise<AxiosResponse<ST, any>>
            metodoActualizacion: (identificador: string | number, datos: Extendible) => Promise<AxiosResponse<ST, any>>
            metodoBorrado: (identificador: string | number) => Promise<AxiosResponse<any, any>>
        }
    }
    formulario: {
        esquema: {
            obtenerEsquemaPrincipal: (objeto?: T) => Extendible,
            obtenerEsquemaSubObjeto: (objeto?: T, subObjeto?: ST) => Extendible
        }
        valoresPorDefecto?: {
            principal?: Extendible,
            subObjeto?: Extendible
        }
    }
}

interface BotonDeAccionProps {
    /**
     * Icono a mostrar en el botón. Debe ser un componente de icono de React Icons (ElementType).
     */
    icono: ElementType;
    /**
     * Color del icono (string de color de Chakra UI).
     */
    color: string;
    /**
     * Función opcional que se ejecuta al hacer clic en el botón. Puede recibir argumentos variables.
     */
    accion?: (...args: any) => void;
}

export const BotonDeAccion = (props: BotonDeAccionProps) => {
    // Se extraen las propiedades del componente.
    const { icono, color, accion } = props;
    return (
        <Icon
            w='100%'
            color={color}
            as={icono}
            h='2vh'
            _hover={{ cursor: 'pointer', h: '2.2vh' }}
            onClick={accion}
        />
    );
};

export function TablaAccionable<T extends Extendible, ST extends Extendible>(
    props: TablaAccionableProps<T, ST>
) {

    const { contexto, general, tabla, formulario } = props
    const { campoIdentificadorObjeto, formatearObjeto, metodoCrear, metodoListado } = general
    const { itemsEncabezado, subElementos, metodoActualizacion, metodoBorrado, metodoExportado } = tabla

    const [objetos, establecerObjetos] = useState<T[]>([])
    const [objetosFormateados, establecerObjetosFormateados] = useState<T[]>([])
    const [objetoSeleccionado, seleccionarObjeto] = useState<T>()
    const [subObjetoSeleccionado, seleccionarSubObjeto] = useState<ST>()
    const [indexObjetoExpandido, expandirObjeto] = useState<number | null>(null)
    const [alertaAccion, _establecerAlertaAccion] = useState<AlertaAccion>()
    const [id, _refrescarVista] = useState<number>(random())

    const { isOpen: alertaAbierta, onOpen: mostrarAlerta, onClose: ocultarAlerta } = useDisclosure()
    const { isOpen: alertaBorradoAbierta, onOpen: mostrarAlertaBorrado, onClose: ocultarAlertaBorrado } = useDisclosure()
    const { isOpen: formularioCrearAbierto, onOpen: mostrarFormularioCrear, onClose: ocultarFormularioCrear } = useDisclosure()
    const { isOpen: subFormularioCrearAbierto, onOpen: mostrarSubFormularioCrear, onClose: ocultarSubFormularioCrear } = useDisclosure()
    const { isOpen: formularioEditarAbierto, onOpen: mostrarFormularioEditar, onClose: ocultarFormularioEditar } = useDisclosure()
    const { isOpen: subFormularioEditarAbierto, onOpen: mostrarSubFormularioEditar, onClose: ocultarSubFormularioEditar } = useDisclosure()

    const cerrarAlertaBorradoRef = useRef<HTMLButtonElement>(null);
    const rellenoSubElementos: null[] = Array(subElementos.relleno).fill(null);

    const refrescarVista = () => {
        _refrescarVista(Math.random())
    }

    const establecerAlertaAccion = (alertaAccion: AlertaAccion) => {
        _establecerAlertaAccion(alertaAccion)
        mostrarAlerta()
    }

    const obtenerObjetos = () => {
        metodoListado().then(
            (response: AxiosResponse<T[]>) => {
                establecerObjetos(response.data)
                establecerObjetosFormateados(
                    response.data.map(
                        (objeto: T) => {
                            if (formatearObjeto) {
                                objeto = formatearObjeto(objeto)
                            }
                            return objeto
                        }
                    )
                )
            }
        )
    }

    const crearObjeto = (datos: Extendible) => {
        metodoCrear(datos as T).then(
            (..._) => {
                establecerAlertaAccion(
                    {
                        tipo: 'exito',
                        detalle: `${contexto.titulo} creado correctamente.`
                    }
                )
                refrescarVista()
                ocultarFormularioCrear()
            }
        ).catch(
            (error: AxiosError) => {
                establecerAlertaAccion(
                    {
                        tipo: 'error',
                        detalle: `No se pudo crear el ${contexto.titulo} (${error.response?.status})`
                    }
                )
            }
        )
    }

    const exportarObjeto = (objeto: T) => {
        let identificador = objeto[campoIdentificadorObjeto]
        metodoExportado(identificador).then(
            (response: AxiosResponse<Blob>) => {
                const contentType = response.headers['content-type']
                console.log(contentType)
                const blob = new Blob([response.data], { type: contentType });
                const urlObjeto = window.URL.createObjectURL(blob);
                const enlace = document.createElement('a');
                enlace.href = urlObjeto;
                enlace.download = tabla.obtenerNombreArchivo(objeto);
                document.body.appendChild(enlace);
                enlace.click();
                document.body.removeChild(enlace);
                window.URL.revokeObjectURL(urlObjeto);
            }
        ).catch(
            async (error: AxiosError<Blob>) => {
                if (error.response) {
                    let contenido: ErrorAPI = {}
                    contenido = JSON.parse(await error.response.data.text())
                    establecerAlertaAccion(
                        {
                            tipo: 'error',
                            detalle: obtenerPrimerValor(contenido as ErrorAPI)
                        }
                    )
                }
            }
        )
    }

    const actualizarObjeto = (datos: Extendible) => {
        if (objetoSeleccionado) {
            let identificador = objetoSeleccionado[campoIdentificadorObjeto]
            metodoActualizacion(identificador, datos).then().catch(
                (..._) => {
                    establecerAlertaAccion(
                        {
                            tipo: 'error',
                            detalle: `No se pudo actualizar el ${contexto.titulo} ${identificador}.`
                        }
                    )
                }
            )
            refrescarVista()
            ocultarFormularioEditar()
        }
    }

    const crearSubObjeto = (datos: Extendible) => {
        subElementos.metodoCrear(datos as ST).then(
            (..._) => {
                establecerAlertaAccion(
                    {
                        tipo: 'exito',
                        detalle: `${startCase(subElementos.llave)} creado correctamente.`
                    }
                )
                refrescarVista()
                ocultarSubFormularioCrear()
            }
        ).catch(
            (error: AxiosError) => {
                establecerAlertaAccion(
                    {
                        tipo: 'error',
                        detalle: `No se pudo crear el ${startCase(subElementos.llave)} (${error.response?.status})`
                    }
                )
            }
        )
    }

    const actualizarSubObjeto = (datos: Extendible) => {
        if (subObjetoSeleccionado) {
            let identificador = subObjetoSeleccionado[subElementos.campoIdentificador]
            subElementos.metodoActualizacion(identificador, datos).then().catch(
                (..._) => {
                    establecerAlertaAccion(
                        {
                            tipo: 'error',
                            detalle: `No se pudo actualizar el ${startCase(subElementos.llave)} ${identificador}.`
                        }
                    )
                }
            )
            refrescarVista()
            ocultarSubFormularioEditar()
        }
    }

    const borrarObjeto = (objeto?: T) => {
        if (objeto) {
            let identificador = objeto[campoIdentificadorObjeto]
            metodoBorrado(identificador).then(
                (..._) => {
                    establecerAlertaAccion(
                        {
                            tipo: 'advertencia',
                            detalle: `Se eliminó el ${contexto.titulo} con éxito.`
                        }
                    )
                    refrescarVista()
                }
            ).catch(
                (error: AxiosError<ErrorAPI>) => {
                    establecerAlertaAccion(
                        {
                            tipo: 'error',
                            detalle: obtenerPrimerValor(error.response?.data)
                        }
                    )
                }
            )
        }
    }

    const borrarSubObjeto = (subObjeto?: ST) => {
        if (subObjeto) {
            let identificador = subObjeto[subElementos.campoIdentificador]
            subElementos.metodoBorrado(identificador).then(
                (..._) => {
                    establecerAlertaAccion(
                        {
                            tipo: 'advertencia',
                            detalle: `Se eliminó el ${startCase(subElementos.llave)} con éxito.`
                        }
                    )
                    refrescarVista()
                }
            ).catch(
                (error: AxiosError<ErrorAPI>) => {
                    establecerAlertaAccion(
                        {
                            tipo: 'error',
                            detalle: obtenerPrimerValor(error.response?.data)
                        }
                    )
                }
            )
        }
    }

    const abrirAlertaBorrado = (objeto: T) => {
        seleccionarObjeto(objeto)
        seleccionarSubObjeto(undefined)
        mostrarAlertaBorrado()
    }

    const abrirFormularioEditar = (objeto: T) => {
        seleccionarObjeto(objeto)
        mostrarFormularioEditar()
    }

    const abrirAlertaBorradoSub = (subObjeto: ST) => {
        seleccionarSubObjeto(subObjeto)
        seleccionarObjeto(undefined)
        mostrarAlertaBorrado()
    }

    const abrirSubFormularioCrear = (objeto: T) => {
        seleccionarObjeto(objeto)
        mostrarSubFormularioCrear()
    }

    const abrirSubFormularioEditar = (objeto: T, subObjeto: ST) => {
        seleccionarObjeto(objeto)
        seleccionarSubObjeto(subObjeto)
        mostrarSubFormularioEditar()
    }

    useEffect(() => {
        obtenerObjetos()
    }, [id])

    return (
        <Flex direction='column' w='100%' key={id}>
            <FormularioModalDinamico
                modo='crear'
                valoresPorDefecto={formulario.valoresPorDefecto?.principal}
                titulo={contexto.titulo}
                esquema={formulario.esquema.obtenerEsquemaPrincipal(objetoSeleccionado)}
                manejarSubmit={crearObjeto}
                abierto={formularioCrearAbierto}
                cerrarModal={ocultarFormularioCrear}
            />
            <FormularioModalDinamico
                modo='editar'
                datos={objetoSeleccionado}
                titulo={contexto.titulo}
                esquema={formulario.esquema.obtenerEsquemaPrincipal(objetoSeleccionado)}
                manejarSubmit={actualizarObjeto}
                abierto={formularioEditarAbierto}
                cerrarModal={ocultarFormularioEditar}
            />
            <FormularioModalDinamico
                modo='crear'
                valoresPorDefecto={formulario.valoresPorDefecto?.subObjeto}
                titulo={startCase(subElementos.llave)}
                esquema={formulario.esquema.obtenerEsquemaSubObjeto(objetoSeleccionado, subObjetoSeleccionado)}
                manejarSubmit={crearSubObjeto}
                abierto={subFormularioCrearAbierto}
                cerrarModal={ocultarSubFormularioCrear}
            />
            <FormularioModalDinamico
                modo='editar'
                datos={subObjetoSeleccionado}
                titulo={startCase(subElementos.llave)}
                esquema={formulario.esquema.obtenerEsquemaSubObjeto(objetoSeleccionado, subObjetoSeleccionado)}
                manejarSubmit={actualizarSubObjeto}
                abierto={subFormularioEditarAbierto}
                cerrarModal={ocultarSubFormularioEditar}
            />
            <Flex mb={'2dvh'}>
                <Button leftIcon={<BiPlusCircle />} colorScheme='green' mr={'2dvh'} onClick={mostrarFormularioCrear}>
                    Agregar {contexto.titulo}
                </Button>
                <Button leftIcon={<BiRefresh />} colorScheme='blue' onClick={() => refrescarVista()}>
                    Refrescar {contexto.plural}
                </Button>
            </Flex>
            <AlertaModal alertaAbierta={alertaAbierta} alertaAccion={alertaAccion} cerrarAlerta={ocultarAlerta} />
            {objetos.length > 0 ?
                <>
                    <AlertDialog isOpen={alertaBorradoAbierta} leastDestructiveRef={cerrarAlertaBorradoRef} onClose={ocultarAlertaBorrado} isCentered={true}>
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
                                <Button ref={cerrarAlertaBorradoRef} onClick={ocultarAlertaBorrado} mr='10px'>
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (objetoSeleccionado && !subObjetoSeleccionado) {
                                            borrarObjeto(objetoSeleccionado);
                                        } else if (subObjetoSeleccionado) {
                                            borrarSubObjeto(subObjetoSeleccionado)
                                        }
                                        ocultarAlertaBorrado();
                                    }}
                                    colorScheme={'orange'}
                                >
                                    Eliminar
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Contenedor de la tabla */}
                    <TableContainer w='100%'>
                        {/* Componente Table de Chakra UI */}
                        <Table variant="simple">
                            {/* Encabezado de la tabla */}
                            <Thead textAlign='center'>
                                <Tr>
                                    <Th colSpan={1}>{"  "}</Th> {/* Columna para el botón de expandir/contraer */}
                                    {/* Mapeo de los encabezados principales */}
                                    {itemsEncabezado.map((header) => (
                                        <Th key={header}>{startCase(header)}</Th>
                                    ))}
                                    {/* Columnas para las acciones */}
                                    <Th colSpan={1} textAlign='center'>Exportar</Th>
                                    <Th colSpan={1} textAlign='center'>Editar</Th>
                                    <Th colSpan={1} textAlign='center'>Crear Item</Th>
                                    <Th colSpan={1} textAlign='center'>Eliminar</Th>
                                </Tr>
                            </Thead>

                            {/* Cuerpo de la tabla */}
                            <Tbody>
                                {/* Mapeo de los datos principales */}
                                {objetos.map((objeto, idx) => (
                                    <Fragment key={idx}>
                                        {/* Fila principal del dato */}
                                        <Tr key={`main-${idx}`} backgroundColor='#1a202cc7'>
                                            <Td>
                                                {/* Botón para expandir/contraer los sub-elementos */}
                                                {indexObjetoExpandido !== idx ? (
                                                    <BotonDeAccion
                                                        icono={AiOutlineDown}
                                                        accion={() => expandirObjeto(idx)}
                                                        color='yellow.100'
                                                    />
                                                ) : (
                                                    <BotonDeAccion
                                                        icono={AiOutlineUp}
                                                        accion={() => expandirObjeto(null)}
                                                        color='yellow.100'
                                                    />
                                                )}
                                            </Td>
                                            {/* Mapeo de los valores de las columnas principales */}
                                            {itemsEncabezado.map((header) => (
                                                <Td key={`${idx}-${header}`}>{objetosFormateados[idx][header]}</Td>
                                            ))}
                                            {/* Botones de acción para cada fila principal */}
                                            <Td><BotonDeAccion icono={AiOutlineExport} accion={() => exportarObjeto(objeto)} color='blue.500' /></Td>
                                            <Td><BotonDeAccion icono={AiFillEdit} accion={() => abrirFormularioEditar(objeto)} color='yellow.500' /></Td>
                                            <Td><BotonDeAccion icono={AiFillPlusCircle} accion={() => abrirSubFormularioCrear(objeto)} color='green.500' /></Td>
                                            <Td><BotonDeAccion icono={AiFillDelete} accion={() => abrirAlertaBorrado(objeto)} color='red.500' /></Td>
                                        </Tr>

                                        {/* Renderizado condicional de la fila expandida */}
                                        {indexObjetoExpandido === idx && (
                                            <>
                                                {/* Fila que indica la cantidad de sub-elementos */}
                                                <Tr key={`sub-header-${idx}`} backgroundColor={'black'}>
                                                    <Td colSpan={itemsEncabezado.length + 5}>
                                                        <Flex>
                                                            <Text textAlign={'center'} w={'100%'}>
                                                                {`${(objeto[subElementos.llave] as unknown as ST[]).length} ${contexto.subtitulo}`}
                                                            </Text>
                                                        </Flex>
                                                    </Td>
                                                </Tr>
                                                {/* Mapeo de los sub-elementos */}
                                                {(objeto[subElementos.llave] as unknown as ST[]).map((subObjeto, subidx) => (
                                                    <Tr key={`sub-${idx}-${subidx}`}>
                                                        <Td colSpan={1}>
                                                            <Text as='b' ml='2dvh'>{'->'}</Text>
                                                        </Td>
                                                        {/* Mapeo de los campos de los sub-elementos */}
                                                        {subElementos.campos.map((campo, idxcampo) => (
                                                            <Td
                                                                key={`sub-data-${subidx}-${campo}`}
                                                                colSpan={subElementos.anchoCampos[idxcampo]}
                                                                overflow='hidden'
                                                                whiteSpace='nowrap'
                                                                textOverflow='ellipsis'
                                                            >
                                                                <Flex w='100%'>
                                                                    {startCase(campo)}:
                                                                    <Text as='b'>&nbsp;{objetosFormateados[idx][subElementos.llave][subidx][campo] ?? 'N/A'}</Text>
                                                                </Flex>
                                                            </Td>
                                                        ))}
                                                        {/* Botones de acción para cada sub-elemento */}
                                                        <Td colSpan={1}>
                                                            <BotonDeAccion icono={AiFillEdit} accion={() => abrirSubFormularioEditar(objeto, subObjeto)} color='yellow.200' />
                                                        </Td>
                                                        <Td colSpan={1}>
                                                            <BotonDeAccion icono={AiFillDelete} accion={() => abrirAlertaBorradoSub(subObjeto)} color='red.200' />
                                                        </Td>
                                                        {/* Relleno de celdas vacías para alinear con las columnas principales */}
                                                        {rellenoSubElementos.map((_, i) => <Td key={`sub-fill-${subidx}-${i}`}></Td>)}
                                                    </Tr>
                                                ))}
                                            </>
                                        )}
                                    </Fragment>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </>
                : <Text fontSize='2dvh' textAlign={'center'} marginTop={'auto'} marginBottom={'auto'}>No hay {contexto.plural} para mostrar por los momentos.</Text>
            }
        </Flex >
    )
}