export const scaleQualities = ['nearest', 'linear'] as const;
export type ScaleQuality = (typeof scaleQualities)[number];

/**
 * `Core` functions exposed to the `editor` module
 * @fn Parse Parses and runs the provided JSON abstract syntax tree in the daemon
 * @fn Terminate Terminates the daemon
 * @fn SetCanvasSize Sets the canvas size
 * @fn GetCanvasWidth Gets the canvas width
 * @fn GetCanvasHeight Gets the canvas height
 * @fn ClearCanvas Clears the canvas
 */
export type CoreApi = {
  readonly Run: (program: string) => void;
  readonly Terminate: () => void;
  readonly SetCanvasSize: (width: number, height: number) => void;
  readonly GetCanvasWidth: () => number;
  readonly GetCanvasHeight: () => number;
  readonly ClearCanvas: () => void;

  readonly SetScaleQuality: (scaleQuality: ScaleQuality) => void;
  readonly GetScaleQuality: () => ScaleQuality;
};
