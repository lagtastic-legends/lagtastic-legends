export async function fetchAndDownload(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          "Access forbidden. The server does not allow downloads from browsers.",
        );
      }
      if (response.status === 404) {
        throw new Error("File not found. Please check the URL.");
      }
      throw new Error(`Download failed with status ${response.status}`);
    }

    const blob = await response.blob();

    // Try to get filename from headers or URL
    let filename = "download";
    const contentDisposition = response.headers.get("content-disposition");

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=(['"]).*?\1|[^;\n]*/,
      );
      if (filenameMatch?.[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    } else {
      // Extract from URL
      const urlPath = new URL(url).pathname;
      const urlFilename = urlPath.split("/").pop();
      if (urlFilename) {
        filename = urlFilename;
      }
    }

    // Trigger download
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);

    return filename;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "CORS error: The server does not allow cross-origin requests. This is common with YouTube, Instagram, and other platforms that block browser downloads.",
      );
    }
    throw error;
  }
}
