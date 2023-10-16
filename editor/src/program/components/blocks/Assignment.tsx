import { ReactElement } from 'react';
import { IsLiteral } from 'types';
import { BlockRoot } from '../generic';
import { IsVariable } from 'types/predicates';
import { s } from 'theme/stitches.config';
import { Assignment, Component } from 'types';
import { useVariableDefinition } from 'program';
import { GenericExpression } from '../expressions/Expression';
import { IsOperation, IsCondition } from '../../../types/predicates';

export function AssignmentBlock({
  block,
  preview = false,
}: {
  block: Assignment;
  preview?: boolean;
}): ReactElement | null {
  const lValuePredicate = (c: Component) => IsVariable(c);
  const rValuePredicate = (c: Component) =>
    IsVariable(c) || IsOperation(c) || IsLiteral(c) || IsCondition(c);

  const definition = useVariableDefinition(block.lvalue?.definitionId);
  const assignableLiteral = definition?.primitive ?? 'string';

  return (
    <BlockRoot
      preview={preview}
      block={block}
      css={styles}
      color="$violet"
      colorTonal="$violetTonal"
      onColor="$onViolet"
    >
      <GenericExpression
        parent={{
          id: block.id,
          locale: 'lvalue',
          dropPredicate: lValuePredicate,
        }}
        expression={block.lvalue}
        options={{
          literals: false,
          operation: false,
          subscript: false,
        }}
      />
      <Assign />
      <GenericExpression
        parent={{
          id: block.id,
          locale: 'rvalue',
          dropPredicate: rValuePredicate,
        }}
        expression={block.rvalue}
        options={{ literals: [assignableLiteral] }}
      />
    </BlockRoot>
  );
}

const Assign = () => <s.span> = </s.span>;

const styles = {
  items: 'center',
  direction: 'row',
  gap: 16,
};
