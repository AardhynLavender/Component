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

const fileType = {
  json: {
    extension: ['.json'],
    mimeType: 'application/json',
  },
  text: {
    extension: ['.txt'],
    mimeType: 'text/plain',
  },
} as const;

export type FileType = keyof typeof fileType;

export type Json = Record<string, Serializable>;

export function saveFile(data: Serializable, filename: string, type: FileType) {
  const serialized = serialize(data);

  const blob = new Blob([serialized], { type: fileType[type].mimeType });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.download = filename;
  anchor.href = url;
  placeAnchor(anchor, (anchor) => anchor.click());

  URL.revokeObjectURL(url);
}

export function loadFile<
  T extends FileType,
  R = T extends 'json' ? Json : string,
>(type: T) {
  return new Promise<R>((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'json' ? '.json' : '.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return reject(new Error('No file selected'));

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (typeof data !== 'string') return reject(new Error('Invalid data'));

        switch (type) {
          case 'json':
            try {
              const json = JSON.parse(data);
              return resolve(json);
            } catch (error) {
              return reject(error);
            }
          case 'text':
            return resolve(data as unknown as R);
          default:
            return reject(new Error(`Unknown file type: ${type}`));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
}
