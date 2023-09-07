import { Drag } from 'util/Drag';
import { ReactElement } from 'react';
import { Variable } from 'types';
import { ExpressionParent } from '../expressions/types';
import { useVariableDefinition } from 'program/store';
import { styled, s } from 'theme/stitches.config';
import Badge from 'components/ui/Badge';
import { ExpressionDropzone } from 'program/components/dropzone';

export function VariableExpression({
  variable,
  parent,
  preview = false,
}: {
  variable: Variable;
  parent?: ExpressionParent;
  preview?: boolean;
}): ReactElement | null {
  const definition = useVariableDefinition(variable.definitionId); // fetch variable from store

  const { DragHandle } = Drag.useComponentDragHandle(variable, preview);

  return (
    <ExpressionDropzone
      parentId={parent?.id}
      locale={parent?.locale}
      dropPredicate={parent?.dropPredicate}
      enabled={!preview}
      error={!variable}
    >
      <DragHandle css={{ d: 'flex', items: 'center', gap: 4 }}>
        {definition ? (
          <>
            <span>{definition.name}</span>
            <span>:</span>
            <Badge color="neutral" size="small">
              {definition.primitive}
            </Badge>
          </>
        ) : (
          <>
            <span>unknown</span>
            <span>:</span>
            <Badge color="neutral" size="small">
              never
            </Badge>
          </>
        )}
      </DragHandle>
    </ExpressionDropzone>
  );
}
