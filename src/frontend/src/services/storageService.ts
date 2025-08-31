import { api } from "./api";

export interface Media {
  fileName: string;
  thumbnailFileName: string;
  mediaProvider: string;
  size: number;
  expiresAt: string; // o Date si lo vas a parsear
}

export interface StorageResponse {
  storageUse: number;
  medias: Media[];
}

export interface GeneratePresigned {
  fileName: string;
  size: number;
}

export interface PresignedUrlResponse {
  storageProvider: string;
  url: string;
  httpVerb: string;
  headers: Record<string, string>;
  mediaId: number;
  expiresAt: string;
}

export interface SetUploadedRequest {
  mediaId: number;
}

export async function getOverview(): Promise<StorageResponse> {
  return api.get("/accountstorage/overview").then((res) => res.data);
}
export async function generatePresigned(
  data: GeneratePresigned,
): Promise<PresignedUrlResponse> {
  return api
    .post("/accountstorage/prepare-upload", data)
    .then((res) => res.data);
}

export async function setUploaded(data : SetUploadedRequest) : Promise<void>{
  return api.post("/accountstorage/set-uploaded",data).then((res) => res.data);
}