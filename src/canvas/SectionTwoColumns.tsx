import { FC } from 'react';
import { UniformSlot, ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import BaseSectionTwoColumns, { Props as BaseProps } from '../components/SectionTwoColumns';

type Props = ComponentProps<BaseProps>;

const SectionTwoColumns: FC<Props> = ({
  columnWidths = '1/2 - 1/2',
  verticalAlignment,
  mobileItemsOrder,
  hasBottomBorder,
}) => (
  <BaseSectionTwoColumns
    columnWidths={columnWidths}
    verticalAlignment={verticalAlignment}
    mobileItemsOrder={mobileItemsOrder}
    hasBottomBorder={hasBottomBorder}
    leftContent={<UniformSlot name="leftContent" />}
    rightContent={<UniformSlot name="rightContent" />}
  />
);

registerUniformComponent({
  type: 'sectionTwoColumns',
  component: SectionTwoColumns,
});

export default SectionTwoColumns;
