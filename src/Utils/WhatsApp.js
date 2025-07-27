export function obtenerElementoAleatorio(arreglo) {
  if (!Array.isArray(arreglo) || arreglo.length === 0) {
    throw new Error("Debes proporcionar un arreglo no vacío");
  }
  const indiceAleatorio = Math.floor(Math.random() * arreglo.length);
  return arreglo[indiceAleatorio];
}

