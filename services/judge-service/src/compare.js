function normalize(text) {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trimEnd();
}

export function outputsMatch(actual, expected) {
  return normalize(actual) === normalize(expected);
}
