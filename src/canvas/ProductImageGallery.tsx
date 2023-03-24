import { FC } from 'react';
import { ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import BaseProductImageGallery from '../components/ProductImageGallery';

type Props = ComponentProps<{
  product: Type.Product;
}>;

const ProductImageGallery: FC<Props> = ({ product }) => <BaseProductImageGallery product={product} />;

registerUniformComponent({
  type: 'productImageGallery',
  component: ProductImageGallery,
});

export default ProductImageGallery;
