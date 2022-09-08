import {FC, ReactNode, createElement} from 'react';

const ELEMENT = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  label: 'label',
  span: 'span',
  p: 'p',
};

const tagsSupported = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'p',
  'label',
  'span',
] as const;

type TagsSupported = typeof tagsSupported[number];

export type TypographyFamily = 'font-openSauce' | 'font-roboto' | 'font-archivo';

export type TypographyColor = 'text-dark900' | 'text-dark500' | 'text-dark300' | 'text-dark400' |'text-primary' | 'text-white' | 'text-transparent'

export type TypographyType = 'text-caption2' | 'text-caption1' | 'text-body' | 'text-subtitle2' | 'text-subtitle1' | 'text-h3' | 'text-h2' | 'text-h1' | 'text-title' | 'text-tiny';

export interface TypographyProps {
  className?: string;
  color?: TypographyColor;
  darkMode?: string,
  children: ReactNode | ReactNode[];
  as?: TagsSupported;
  type?: TypographyType;
  isBold?: boolean;
  fontWeight?: 'font-bold' | 'font-normal' | 'font-light';
  family?: TypographyFamily;
  dataTestId?: string;
}

const Typography: FC<TypographyProps> = ({
   as,
   type = 'text-body',
   isBold,
   color = 'text-dark900',
    darkMode = 'dark:text-dark300',
   className,
    fontWeight = 'font-normal',
   children,
    family = 'font-openSauce',
    ...props
 }) => {

  return createElement(
      as ? ELEMENT[as] : ELEMENT.p,
      {
        ...props,
        className: `${className || ''} ${type} m-0 ${darkMode} ${color} ${family} ${isBold ? 'font-bold' : fontWeight}
`,
      },
      children
  );
};

export default Typography;
