import { FC } from 'react';
import { ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import BaseAddToCart from '../components/AddToCart';

type Props = ComponentProps<{
  product: Type.Product;
}>;

const AddToCart: FC<Props> = ({ product }) => <BaseAddToCart product={product} />;

registerUniformComponent({
  type: 'addToCart',
  component: AddToCart,
});

export default AddToCart;
