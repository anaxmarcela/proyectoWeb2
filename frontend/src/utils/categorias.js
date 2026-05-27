export const CATEGORIAS = [
  { id: "accion",     nombre: "Acción",         emoji: "💥", color: "#E74C3C" }, // rojo
  { id: "comedia",    nombre: "Comedia",         emoji: "😂", color: "#F39C12" }, // ámbar
  { id: "drama",      nombre: "Drama",           emoji: "🎭", color: "#2980B9" }, // azul
  { id: "terror",     nombre: "Terror",          emoji: "👻", color: "#85929E" }, // gris frío
  { id: "ciencia_fi", nombre: "Ciencia Ficción", emoji: "🚀", color: "#00ACC1" }, // cian
  { id: "animacion",  nombre: "Animación",       emoji: "🎨", color: "#27AE60" }, // verde
  { id: "documental", nombre: "Documental",      emoji: "🎥", color: "#D4AC0D" }, // dorado
  { id: "thriller",   nombre: "Thriller",        emoji: "🔪", color: "#D35400" }, // naranja oscuro
  { id: "romance",    nombre: "Romance",         emoji: "❤️", color: "#E91E63" }, // rosa
  { id: "fantasia",   nombre: "Fantasía",        emoji: "🧙", color: "#8E44AD" }, // violeta
];

export const getCategoriaById = (id) =>
  CATEGORIAS.find((c) => c.id === id) || null;