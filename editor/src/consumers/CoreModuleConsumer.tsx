import React, { HTMLAttributes, ReactElement } from 'react';
import useCoreModule from 'hooks/useCoreModule';
import { CoreApi } from 'types';

export default function CoreModuleConsumer({
  onLoaded,
  onLoading,
  onError,
  ...props
}: {
  onError?: (error: unknown) => ReactElement | ReactElement[] | undefined;
  onLoading?: ReactElement | ReactElement[] | undefined;
  onLoaded?: (module: CoreApi) => ReactElement | ReactElement[];
  props?: HTMLAttributes<HTMLDivElement>;
}) {
  const { module, error } = useCoreModule();

  let value: ReactElement | ReactElement[] | null | undefined;
  if (error) value = onError ? onError(error) : null; // render the error
  else if (module)
    value = onLoaded ? onLoaded(module) : null; // consume the module
  else value = onLoading ? onLoading : null; // show loading

  return <div {...props}>{value}</div>;
}
