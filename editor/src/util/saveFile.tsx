type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Serializable[]
  | { [key: string]: Serializable };

function serialize(data: Serializable) {
  if (typeof data === 'object') return JSON.stringify(data);
  if (data === undefined || data === null) return 'undefined';
  if (typeof data === 'number' || typeof data === 'boolean')
    return data.toString();
  return data;
}

function placeAnchor(
  anchor: HTMLAnchorElement,
  onPlace: (anchor: HTMLAnchorElement) => void,
) {
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  onPlace(anchor);
  document.body.removeChild(anchor);
}

const mimeType = {
  json: 'application/json',
  text: 'text/plain',
} as const;
export type FileType = keyof typeof mimeType;
export type MimeType = (typeof mimeType)[FileType];

export function save(data: Serializable, filename: string, type: FileType) {
  const serialized = serialize(data);

  const blob = new Blob([serialized], { type: mimeType[type] });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.download = filename;
  anchor.href = url;
  placeAnchor(anchor, (anchor) => anchor.click());

  URL.revokeObjectURL(url);
}
