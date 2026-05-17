export const CATEGORIAS = [
  { id: "accion",       nombre: "Acción",          emoji: "💥", color: "#E74C3C" },
  { id: "comedia",      nombre: "Comedia",          emoji: "😂", color: "#F39C12" },
  { id: "drama",        nombre: "Drama",            emoji: "🎭", color: "#8E44AD" },
  { id: "terror",       nombre: "Terror",           emoji: "👻", color: "#2C3E50" },
  { id: "ciencia_fi",   nombre: "Ciencia Ficción",  emoji: "🚀", color: "#2980B9" },
  { id: "animacion",    nombre: "Animación",        emoji: "🎨", color: "#27AE60" },
  { id: "documental",   nombre: "Documental",       emoji: "🎥", color: "#16A085" },
  { id: "thriller",     nombre: "Thriller",         emoji: "🔪", color: "#C0392B" },
  { id: "romance",      nombre: "Romance",          emoji: "❤️", color: "#E91E63" },
  { id: "fantasia",     nombre: "Fantasía",         emoji: "🧙", color: "#6C3483" },
];

export const getCategoriaById = (id) =>
  CATEGORIAS.find((c) => c.id === id) || null;