import { ErrorAPI } from "./api/tipos";

// Se utiliza para sacar el primer error retornado por el backend y mostrarlo
export function obtenerPrimerValor(obj?: ErrorAPI) {
    obj = obj??{}
    const keys = Object.keys(obj);
  
    if (keys.length === 0) {
      return undefined;
    }
  
    const firstKey = keys[0];
    const firstValue: any = obj[firstKey];
  
    if (Array.isArray(firstValue)) {
      return firstValue[0];
    } else {
      return firstValue;
    }
  }