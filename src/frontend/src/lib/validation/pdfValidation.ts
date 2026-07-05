export function validateImages(images: File[]): string | null {
  if (images.length === 0) {
    return "Please select at least one image";
  }

  const validTypes = ["image/jpeg", "image/jpg", "image/png"];
  const invalidFiles = images.filter((img) => !validTypes.includes(img.type));

  if (invalidFiles.length > 0) {
    return "Only JPEG and PNG images are supported";
  }

  return null;
}

export function validateTextPdf(
  title: string,
  body: string,
  fontSize: number,
): string | null {
  if (!title.trim() && !body.trim()) {
    return "Please enter at least a title or body text";
  }

  if (fontSize < 8 || fontSize > 24) {
    return "Font size must be between 8 and 24 points";
  }

  return null;
}
