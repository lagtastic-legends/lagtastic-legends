// PDF generation functionality requires pdf-lib package
// This is not available in the current package.json
// This is a placeholder that provides clear error messaging

export async function createPdfFromText(
  _title: string,
  _body: string,
  _fontSize: number,
): Promise<Blob> {
  throw new Error(
    "PDF generation from text requires the pdf-lib library which is not currently installed. " +
      "This feature needs the pdf-lib package to be added to the project dependencies.",
  );
}
