import { useRef } from 'react';
import {
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Button,
    Text,
    HStack,
    Icon,
} from '@chakra-ui/react';
import { BiErrorCircle, BiCheckCircle } from 'react-icons/bi';

export type AlertaAccion = {
    tipo: 'error' | 'exito' | 'advertencia'
    detalle: string
}

/**
 * Interfaz para las propiedades del componente AlertaErrorAccion.
 */
interface AlertaModalProps {
    /**
     * Booleano que controla la visibilidad de la alerta.
     */
    alertaAbierta: boolean,
    /**
     * Objeto que contiene las especificaciones de la alerta.
     */
    alertaAccion?: AlertaAccion;
    /**
     * Función que se ejecuta al cerrar la alerta (por ejemplo, al hacer clic en "Ok" o fuera del modal).
     */
    cerrarAlerta: () => void;
}

/**
 * Componente funcional React que muestra una alerta de error utilizando el componente AlertDialog de Chakra UI.
 */
export const AlertaModal = (props: AlertaModalProps) => {
    // Se crea una referencia para el elemento que recibirá el foco al cerrar la alerta.
    const { alertaAbierta, alertaAccion, cerrarAlerta } = props
    const okRef = useRef<HTMLButtonElement>(null);

    // El estado isOpenError y las funciones onCloseError y onOpenError se gestionan directamente
    // a través de las props 'alertaAccion' y 'onClose' que controlan la visibilidad externamente.
    // Esto hace que el componente sea controlado por su padre.

    const IconoAlerta = () => {
        let icono = null
        switch (alertaAccion?.tipo) {
            case 'error':
                icono = (
                    <>
                        <Icon as={BiErrorCircle} color='red.500' h='3vh' w='3vh' />
                        <Text mt={'auto'}>Ups...</Text>
                    </>
                )
                break
            case 'exito':
                icono = (
                    <>
                        <Icon as={BiCheckCircle} color='green.500' h='3vh' w='3vh' />
                        <Text mt={'auto'}>Perfecto!</Text>
                    </>
                )
                break
            case 'advertencia':
                icono = (
                    <>
                        <Icon as={BiErrorCircle} color='yellow.500' h='3vh' w='3vh' />
                        <Text mt={'auto'}>Alerta!</Text>
                    </>
                )
                break
        }
        return (
            <HStack>
                {icono}
            </HStack>
        )
    }

    return (
        <>
            {alertaAccion ? (
                <AlertDialog
                    isOpen={alertaAbierta}
                    leastDestructiveRef={okRef}
                    onClose={cerrarAlerta}
                    isCentered={true}
                >
                    <AlertDialogOverlay />
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            <IconoAlerta/>
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            {alertaAccion.detalle}
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={okRef} onClick={cerrarAlerta}>
                                Ok
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            ) : null}
        </>
    );
};

export default AlertaModal;