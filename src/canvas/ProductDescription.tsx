import { FC } from 'react';
import { ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import BaseProductDescription from '../components/ProductDescription';

type Props = ComponentProps<{
  title: string;
  product: Type.Product;
}>;

const ProductDescription: FC<Props> = ({ title, product }) => (
  <BaseProductDescription title={title} product={product} />
);

registerUniformComponent({
  type: 'productDescription',
  component: ProductDescription,
});

export default ProductDescription;
