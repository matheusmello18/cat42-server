module.exports.removeCaracteresEspeciais = (texto) => {
  return texto.normalize('NFD')
    .replace(/[\u0300-\u036f/"'/]/g, '')
    .replace('ª','a')
    .replace('*','o');
}