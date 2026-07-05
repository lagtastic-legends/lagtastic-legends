export function validateBitrate(bitrate: string): string | null {
  const bitrateNum = Number.parseInt(bitrate);

  if (Number.isNaN(bitrateNum)) {
    return "Bitrate must be a valid number";
  }

  if (bitrateNum < 100) {
    return "Bitrate must be at least 100 kbps";
  }

  if (bitrateNum > 50000) {
    return "Bitrate must be less than 50000 kbps";
  }

  return null;
}
