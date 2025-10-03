export function getFileExtension(url: string) {
  const cleanUrl = url.split("?")[0].split("#")[0];
  return cleanUrl.split(".").pop();
}

export function getFilename(url: string) {
  const cleanUrl = url.split("?")[0].split("#")[0];
  return cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);
}
