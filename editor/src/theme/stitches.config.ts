import {
  createStitches,
  CSS as StitchesCSS,
  CSSProperties as CssProp,
} from '@stitches/react';

const DEFAULT_FONT = 'heebo';
const BACKUP_FONTS = `
  system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,  Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
`;

// See https://stitches.dev/docs/introduction

const config = createStitches({
  media: {
    // from `Tailwind`
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    xxl: '(min-width: 1536px)',
  },
  theme: {
    colors: {
      text: '#24292e',
      primary: '#117dff',
      primary2: '#0f69d5',
      onPrimary: '#fff',
      tonal: '#576069',
      tonal2: '#24292e',
      outline: '#d0d7de',
      outline2: '#e6edf5',
      background: '#fff',
      background2: '#f6f8fa',
      background3: '#e1e4e8',
      error: '#f2e1e3',
      onError: '#e35557',
    },
    fontWeights: {
      normal: 500,
      bold: 900,
    },
    fontSizes: {
      0: '.6rem',
      1: '.8rem',
      2: '1rem', // regular
      3: '1.5rem',
      4: '2.0',
    },
    fonts: {
      main: `${DEFAULT_FONT}, ${BACKUP_FONTS}`,
      mono: `Martian Mono, monospace`,
    },
  },
  utils: {
    // Layout

    d: (display: CssProp['display']) => ({ display }),
    fd: (flexDirection: CssProp['flexDirection']) => ({ flexDirection }),
    pos: (position: CssProp['position']) => ({ position }),
    justify: (justifyContent: CssProp['justifyContent']) => ({
      justifyContent,
    }),
    items: (alignItems: CssProp['alignItems']) => ({ alignItems }),
    direction: (flexDirection: CssProp['flexDirection']) => ({
      flexDirection,
    }),

    z: (zIndex: CssProp['zIndex']) => ({ zIndex }),

    m: (margin: CssProp['margin']) => ({ margin }),
    mt: (marginTop: CssProp['marginTop']) => ({ marginTop }),
    mb: (marginBottom: CssProp['marginBottom']) => ({ marginBottom }),
    ml: (marginLeft: CssProp['marginLeft']) => ({ marginLeft }),
    mr: (marginRight: CssProp['marginRight']) => ({ marginRight }),
    my: (marginY: CssProp['margin']) => ({
      marginTop: marginY,
      marginBottom: marginY,
    }),
    mx: (marginX: CssProp['margin']) => ({
      marginLeft: marginX,
      marginRight: marginX,
    }),

    p: (padding: CssProp['padding']) => ({ padding }),
    pt: (paddingTop: CssProp['paddingTop']) => ({ paddingTop }),
    pb: (paddingBottom: CssProp['paddingBottom']) => ({ paddingBottom }),
    pl: (paddingLeft: CssProp['paddingLeft']) => ({ paddingLeft }),
    pr: (paddingRight: CssProp['paddingRight']) => ({ paddingRight }),
    py: (paddingY: CssProp['padding']) => ({
      paddingTop: paddingY,
      paddingBottom: paddingY,
    }),
    px: (paddingX: CssProp['padding']) => ({
      paddingLeft: paddingX,
      paddingRight: paddingX,
    }),

    // Dimensions

    w: (width: CssProp['width']) => ({ width }),
    h: (height: CssProp['height']) => ({ height }),
    minW: (minWidth: CssProp['minWidth']) => ({ minWidth }),
    minH: (minHeight: CssProp['minHeight']) => ({ minHeight }),
    maxW: (maxWidth: CssProp['maxWidth']) => ({ maxWidth }),
    maxH: (maxHeight: CssProp['maxHeight']) => ({ maxHeight }),

    // Style

    bg: (backgroundColor: CssProp['backgroundColor']) => ({
      backgroundColor,
    }),
    c: (color: CssProp['color']) => ({ color }),

    // Border

    r: (borderRadius: CssProp['borderRadius']) => ({ borderRadius }),
    b: (border: CssProp['border']) => ({ border }),
    bt: (borderTop: CssProp['borderTop']) => ({ borderTop }),
    bb: (borderBottom: CssProp['borderBottom']) => ({ borderBottom }),
    bl: (borderLeft: CssProp['borderLeft']) => ({ borderLeft }),
    br: (borderRight: CssProp['borderRight']) => ({ borderRight }),

    // Shadow

    bs: (boxShadow: CssProp['boxShadow']) => ({ boxShadow }),
  },
});

export const { styled, css, keyframes, globalCss } = config;

const globalStyles = globalCss({
  '@import':
    "url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;900&family=Martian+Mono&display=swap')",
  '*': {
    boxSizing: 'border-box',
    m: 0,
    p: 0,
  },
  code: { fontFamily: `$mono` },
  body: {
    color: '$text',
    lineHeight: 1.5,
    '-webkit-text-size-adjust': '100%',
    fontFamily: `$main`,
    fontSize: 14,
  },
});

export function useGlobalStyles() {
  globalStyles();
}

export type CSS = StitchesCSS<typeof config>;

export const s = {
  a: styled('a'),
  audio: styled('audio'),
  aside: styled('aside'),
  button: styled('button'),
  b: styled('b'),
  canvas: styled('canvas'),
  caption: styled('caption'),
  code: styled('code'),
  div: styled('div'),
  form: styled('form'),
  h1: styled('h1'),
  h2: styled('h2'),
  h3: styled('h3'),
  h4: styled('h4'),
  h5: styled('h5'),
  h6: styled('h6'),
  img: styled('img'),
  input: styled('input'),
  label: styled('label'),
  li: styled('li'),
  ol: styled('ol'),
  p: styled('p'),
  pre: styled('pre'),
  section: styled('section'),
  select: styled('select'),
  span: styled('span'),
  sup: styled('sup'),
  sub: styled('sub'),
  table: styled('table'),
  tbody: styled('tbody'),
  td: styled('td'),
  textarea: styled('textarea'),
  tfoot: styled('tfoot'),
  th: styled('th'),
  thead: styled('thead'),
  tr: styled('tr'),
  ul: styled('ul'),
} as const;
