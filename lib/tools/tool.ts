export function formatTimeRemaining(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  // .padStart(2, '0') : Ajoute un zéro devant si le nombre n'a qu'un chiffre
  return `${mins} : ${secs.toString().padStart(2, '0')}`;
}
