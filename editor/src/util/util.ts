export default function If<
  T extends object | undefined | null,
  F extends object | undefined | null,
>(condition: boolean, onTrue: T, onFalse: F = null as any) {
  return condition ? onTrue : onFalse;
}
