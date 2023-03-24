import { FC } from 'react';
import CurrencyFormatter from './CurrencyFormatter';

interface Props {
  product: Type.Product;
}

const ProductInfo: FC<Props> = ({ product }) => (
  <div className="md:pt-8 pt-4">
    {Boolean(product.name) && <p className="font-bold text-4xl lg:text-5xl">{product.name}</p>}
    <div className="flex flex-row w-28 justify-between mt-8 leading-5 text-2xl">
      {Boolean(product.price) && <CurrencyFormatter amount={product.price} />}
    </div>
    <div className="border-gray-100 border-t-2 my-7" />
  </div>
);

export default ProductInfo;
