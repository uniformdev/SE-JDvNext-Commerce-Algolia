import { FC } from 'react';
import { ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import BaseProductInfo from '../components/ProductInfo';

type Props = ComponentProps<{
  product: Type.Product;
}>;

const ProductInfo: FC<Props> = ({ product }) => <BaseProductInfo product={product} />;

registerUniformComponent({
  type: 'productInfo',
  component: ProductInfo,
});

export default ProductInfo;
