import Button from 'ui/Button';
import {
  ErrorBoundary as ErrorBoundaryPrimitive,
  FallbackProps,
} from 'react-error-boundary';
import { H2 } from 'theme/Typography';
import { CSS, s, styled } from 'theme/stitches.config';

function ErrorFallback({
  error,
  resetErrorBoundary,
  css,
}: {
  css?: any;
} & FallbackProps) {
  return (
    <Root role="alert" css={css}>
      <Center>
        <s.span css={{ fontWeight: 800 }}>Something went wrong</s.span>
        <Code>{error.message}</Code>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </Center>
    </Root>
  );
}
const Root = styled(s.div, {
  bg: '$background',
  c: '$text',
  d: 'flex',
  justify: 'center',
  items: 'center',
  flex: 1,
  w: '100%',
  h: '100%',
});
const Center = styled(s.div, {
  d: 'flex',
  justify: 'center',
  gap: 8,
  items: 'center',
  fd: 'column',
});
const Code = styled(s.pre, {
  p: 8,
  r: 8,
  bg: '$background3',
});

export default function ErrorBoundary({
  children,
  css,
}: {
  children: React.ReactNode;
  css?: CSS;
}) {
  return (
    <ErrorBoundaryPrimitive
      FallbackComponent={(props) => <ErrorFallback {...props} css={css} />}
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundaryPrimitive>
  );
}
