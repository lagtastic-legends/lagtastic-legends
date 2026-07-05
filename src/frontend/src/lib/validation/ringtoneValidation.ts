export function validateTrim(
  startTime: number,
  endTime: number,
  duration: number,
  fadeIn: boolean,
  fadeOut: boolean,
  fadeInDuration: number,
  fadeOutDuration: number,
): string | null {
  if (startTime < 0) {
    return "Start time cannot be negative";
  }

  if (endTime > duration) {
    return "End time cannot exceed audio duration";
  }

  if (startTime >= endTime) {
    return "End time must be greater than start time";
  }

  const segmentDuration = endTime - startTime;

  if (fadeIn && fadeInDuration > segmentDuration) {
    return "Fade in duration cannot exceed segment length";
  }

  if (fadeOut && fadeOutDuration > segmentDuration) {
    return "Fade out duration cannot exceed segment length";
  }

  if (fadeIn && fadeOut && fadeInDuration + fadeOutDuration > segmentDuration) {
    return "Combined fade durations cannot exceed segment length";
  }

  return null;
}
