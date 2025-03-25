import {
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    Stack,
    Button,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  
  type CampoFormulario = {
    nombre: string;
    etiqueta: string;
    tipo: 'texto' | 'email' | 'seleccion' | 'areaTexto' | 'fecha';
    opciones?: { valor: string; etiqueta: string }[];
  };
  
  function generarCamposFormulario<T>(
    tipo: new () => T,
    opciones?: Record<string, Record<string, string>>
  ): CampoFormulario[] {
    const instancia = new tipo();
    return Object.keys(instancia).map((clave) => {
      let tipoCampo: CampoFormulario['tipo'] = 'texto';
  
      // Determinar el tipo de campo basado en el tipo de la propiedad
      if (typeof instancia[clave] === 'string') {
        tipoCampo = 'texto';
      } else if (typeof instancia[clave] === 'number') {
        tipoCampo = 'texto'; // O 'numero', si es necesario
      } else if (typeof instancia[clave] === 'boolean') {
        tipoCampo = 'texto'; // O 'checkbox', si es necesario
      } else if (instancia[clave] instanceof Date) {
        tipoCampo = 'fecha';
      }
  
      // Mapear opciones si están disponibles
      const opcionesCampo = opciones && opciones[clave]
        ? Object.entries(opciones[clave]).map(([valor, etiqueta]) => ({ valor, etiqueta }))
        : undefined;
  
      return {
        nombre: clave,
        etiqueta: clave,
        tipo: tipoCampo,
        opciones: opcionesCampo,
      };
    });
  }
  
  const FormularioDinamico = <T extends object>({
    tipo,
    onSubmit,
    opciones,
  }: {
    tipo: new () => T;
    onSubmit: (datos: T) => void;
    opciones?: Record<string, Record<string, string>>;
  }) => {
    const campos = generarCamposFormulario(tipo, opciones);
    const [datosFormulario, setDatosFormulario] = useState<Partial<T>>({});
  
    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
    };
  
    const manejarEnvio = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(datosFormulario as T);
    };
  
    return (
    
      <form onSubmit={manejarEnvio}>
        <Stack spacing={4}>
          {campos.map((campo) => {
            switch (campo.tipo) {
              case 'texto':
                return (
                  <FormControl key={campo.nombre}>
                    <FormLabel>{campo.etiqueta}</FormLabel>
                    <Input
                      type="texto"
                      name={campo.nombre}
                      value={(datosFormulario as any)[campo.nombre] || ''}
                      onChange={manejarCambio}
                    />
                  </FormControl>
                );
              case 'email':
                return (
                  <FormControl key={campo.nombre}>
                    <FormLabel>{campo.etiqueta}</FormLabel>
                    <Input
                      type="email"
                      name={campo.nombre}
                      value={(datosFormulario as any)[campo.nombre] || ''}
                      onChange={manejarCambio}
                    />
                  </FormControl>
                );
              case 'seleccion':
                return (
                  <FormControl key={campo.nombre}>
                    <FormLabel>{campo.etiqueta}</FormLabel>
                    <Select
                      name={campo.nombre}
                      value={(datosFormulario as any)[campo.nombre] || ''}
                      onChange={manejarCambio}
                    >
                      {campo.opciones &&
                        campo.opciones.map((opcion) => (
                          <option key={opcion.valor} value={opcion.valor}>
                            {opcion.etiqueta}
                          </option>
                        ))}
                    </Select>
                  </FormControl>
                );
              case 'areaTexto':
                return (
                  <FormControl key={campo.nombre}>
                    <FormLabel>{campo.etiqueta}</FormLabel>
                    <Textarea
                      name={campo.nombre}
                      value={(datosFormulario as any)[campo.nombre] || ''}
                      onChange={manejarCambio}
                    />
                  </FormControl>
                );
              case 'fecha':
                return (
                  <FormControl key={campo.nombre}>
                    <FormLabel>{campo.etiqueta}</FormLabel>
                    <Input
                      type="datetime-local"
                      name={campo.nombre}
                      value={(datosFormulario as any)[campo.nombre] ? (datosFormulario as any)[campo.nombre].toISOString().slice(0, 16) : ''}
                      onChange={manejarCambio}
                    />
                  </FormControl>
                );
              default:
                return null;
            }
          })}
          <Button type="submit" colorScheme="blue">
            Enviar
          </Button>
        </Stack>
      </form>
    );
  };
  
  export default FormularioDinamico;