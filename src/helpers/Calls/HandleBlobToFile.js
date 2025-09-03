export function HandleBlobToFile(blob, fileName, mimeType) {
    return new File([blob], fileName, { type: mimeType || blob.type });
}