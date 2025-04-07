import {
    ChakraProvider,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import { Form } from '@rjsf/chakra-ui';
import { Extendible } from '@src/api/tipos';

import { capitalize } from 'lodash';

/**
 * Interfaz que define las propiedades (props) que el componente FormularioModalDinamico espera recibir.
 */
interface FormularioModalDinamicoProps {
    /**
     * Indica el modo del formulario: 'crear' para crear un nuevo elemento o 'editar' para modificar uno existente.
     */
    modo: 'crear' | 'editar';
    /**
     * Datos del elemento a editar. Solo se utiliza cuando el modo es 'editar'.
     */
    datos?: { [attr: string]: any };
    /**
     * Objeto que contiene los valores por defecto para los campos del formulario en el modo 'crear'.
     * La clave del objeto corresponde al nombre del atributo en el esquema.
     */
    valoresPorDefecto?: { [attr: string]: any };
    /**
     * Título del modal del formulario.
     */
    titulo: string;
    /**
     * Esquema JSON que define la estructura y las validaciones del formulario.
     */
    esquema: { [attr: string]: any };
    /**
     * Booleano que controla la visibilidad del modal.
     */
    abierto: boolean;
    /**
     * Función para cerrar el modal. Se llama al hacer clic en el botón de cerrar o fuera del modal.
     */
    cerrarModal: () => void;
    /**
     * Función que maneja el proceso de submisión del formulario, a esta se le inyectan los datos del formulario.
     */
    manejarSubmit: ({ datos }: Extendible) => void
    /**
     * Función opcional para recargar o actualizar la vista que muestra los datos después de una operación exitosa.
     * Recibe argumentos variables (en este caso, se le pasa un número aleatorio generado por Lodash).
     */
    refrescarVista?: (...args: any) => void;
}

/**
 * Componente funcional React que renderiza un formulario dinámico dentro de un modal de Chakra UI.
 * La estructura y las validaciones del formulario se definen mediante un esquema JSON.
 */
function FormularioModalDinamico(props: FormularioModalDinamicoProps) {
    // Se extraen las propiedades recibidas a través del destructuring.
    const { modo, datos, valoresPorDefecto, titulo, esquema, abierto, cerrarModal, manejarSubmit } = props;
    /**
     * Función que se ejecuta cuando el formulario se envía.
     * Realiza la llamada a la API utilizando la función `consultaAPI` proporcionada.
     * @param {any} { formData } - Objeto que contiene los datos del formulario.
     */
    const handleSubmit = ({ formData }: Extendible) => {
        // Llama a la función `manejarSubmit` con los datos del formulario.
        manejarSubmit(formData)
    };

    let datosIniciales = modo === "crear" ? valoresPorDefecto : datos
    for (const key in datosIniciales) {
        if (datosIniciales.hasOwnProperty(key) && datosIniciales[key] === null) {
            datosIniciales[key] = "" as any;
        }
    }

    return (
        <ChakraProvider>
            <>
                {/* Modal de Chakra UI */}
                <Modal isOpen={abierto} onClose={cerrarModal} size="xl">
                    {/* Fondo oscuro que cubre la pantalla cuando el modal está abierto */}
                    <ModalOverlay />
                    {/* Contenido principal del modal */}
                    <ModalContent>
                        {/* Encabezado del modal */}
                        <ModalHeader>{capitalize(modo)} {titulo}</ModalHeader>
                        {/* Botón para cerrar el modal */}
                        <ModalCloseButton />
                        {/* Cuerpo del modal */}
                        <ModalBody>
                            {/* Contenedor vertical para los elementos del formulario */}
                            <VStack align="stretch" spacing={4}>
                                {/* Componente Form de @rjsf/chakra-ui */}
                                <Form
                                    // Esquema JSON que define la estructura del formulario
                                    schema={esquema}
                                    // Esquema de la interfaz de usuario para personalizar la apariencia del formulario
                                    uiSchema={
                                        {
                                            // Configuración para el botón de envío
                                            "ui:submitButtonOptions": {
                                                submitText: "Enviar", // Texto del botón
                                                props: {
                                                    colorScheme: "green", // Color del esquema del botón (verde)
                                                    w: "100%", // Ancho del botón al 100% del contenedor
                                                    my: "10px" // Margen vertical de 10px
                                                }
                                            }
                                        }
                                    }
                                    // Función que se llama al enviar el formulario
                                    onSubmit={handleSubmit}
                                    // Datos iniciales del formulario. Si el modo es 'crear', usa los valores por defecto; si es 'editar', usa los datos proporcionados.
                                    formData={datosIniciales}
                                />
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </>
        </ChakraProvider>
    );
}

export default FormularioModalDinamico;
