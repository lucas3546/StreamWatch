export function playSound(src: string) {
  const audio = new Audio(src);
  audio.play().catch((err) => {
    console.error("Error al reproducir sonido:", err);
  });
}
