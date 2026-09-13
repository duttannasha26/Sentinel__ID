import { appParams } from "@/lib/app-params";
import { base44 as rawClient } from "@/api/client";

const MAX_IMAGE_DIMENSION = 1600;
const JPEG_QUALITY = 0.84;

const resizeImage = (file) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("The image could not be processed."));
          return;
        }
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
      }, "image/jpeg", JPEG_QUALITY);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("The selected file is not a readable image."));
    };
    image.src = objectUrl;
  });

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("The image could not be loaded."));
    reader.readAsDataURL(file);
  });

export async function uploadImage(file) {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("Please select an image file.");
  }

  const optimizedFile = await resizeImage(file);
  if (!appParams.appId || !appParams.appBaseUrl) {
    return fileToDataUrl(optimizedFile);
  }

  const { file_url } = await rawClient.integrations.Core.UploadPublicFile({ file: optimizedFile });
  if (!file_url) {
    throw new Error("The upload service did not return an image URL.");
  }
  return file_url;
}
