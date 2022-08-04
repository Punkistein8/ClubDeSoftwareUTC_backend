const generarId = () => {
  return Date.now().toString(32) + Math.random().toString(32).substring(2); //generar Id unico
}

export default generarId;