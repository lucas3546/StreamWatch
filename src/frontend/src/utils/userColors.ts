const usernameColors: Record<string, string> = {};
const availableColors = [
  "text-red-400",
  "text-green-400",
  "text-blue-400",
  "text-yellow-400",
  "text-purple-400",
  "text-pink-400",
  "text-indigo-400",
];

export function getUsernameColor(userName: string) {
  if (!usernameColors[userName]) {
    const color =
      availableColors[Math.floor(Math.random() * availableColors.length)];

    usernameColors[userName] = color;
  }
  return usernameColors[userName];
}
