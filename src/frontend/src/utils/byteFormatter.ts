export default function formatBytes(
  bytes: number,
  decimals: number = 2,
): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024; // base binaria (cambiá a 1000 si querés decimal)
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));

  return `${value} ${sizes[i]}`;
}
