import { GetStaticProps, GetStaticPaths } from 'next';
import getConfig from 'next/config';
import algoliasearch from 'algoliasearch/lite';
import { enhancerCustomExtenderFactory, getPreEnhancer } from '@/utilities/enhancers/commerce';
import { CommonContainer } from '@/components';
import { getFormattedPath } from '@/utilities';
import { getCompositionProps } from '@/utilities/canvas';
import { getProductIdByProductSlug } from '@/utilities/products';
import { AppPages, DepthOfNavigationLinks, InternalCompositionSlugs, ProductPagesPrefixes } from '@/constants';

const {
  publicRuntimeConfig: { algoliaApplicationId, algoliaSearchKey },
} = getConfig();

const VisualCanvasDefaultParams = {
  productId: '80',
};

const searchClient = algoliasearch(algoliaApplicationId, algoliaSearchKey);

export const getStaticProps: GetStaticProps<{ preview?: boolean }> = async context => {
  const { preview, params } = context;
  const { slug: initialSlug } = params || {};

  const path = getFormattedPath(AppPages.Products, initialSlug);
  const productSlug = String(initialSlug);
  const productsHash = await getMemorizedData();

  if (!productsHash || !productSlug) return { notFound: true };

  const productId = InternalCompositionSlugs.ProductDetails.includes(productSlug)
    ? VisualCanvasDefaultParams.productId
    : getProductIdByProductSlug(productSlug);

  return getCompositionProps({
    path,
    defaultPath: `${AppPages.Products}${InternalCompositionSlugs.ProductDetails}`,
    context,
    navigationLinkOptions: {
      depth: DepthOfNavigationLinks,
      skipPaths: [`${AppPages.Articles}/`, `${AppPages.Products}/`],
    },
    preEnhancer: getPreEnhancer(productId),
    extendEnhancer: enhancerCustomExtenderFactory(productsHash[productId]),
  })
    .then(compositionProps => ({
      props: {
        ...compositionProps,
        preview: Boolean(preview),
        revalidate: Number.MAX_SAFE_INTEGER,
        key: productSlug,
      },
    }))
    .catch(() => ({ notFound: true }));
};

const getAlgoliaProductsHash = async () => {
  const index = searchClient.initIndex('products');

  // setting max count of products to 100, to avoid a lot of static pages, and do not break versel
  const { hits } = await index.search<Type.Product>('', { hitsPerPage: 100 });

  return hits.reduce((acc, product) => ({ ...acc, [product.id]: product }), {});
};

const getMemorizedData = (() => {
  let memo: { [name: string]: Type.Product } | null = null;
  return async () => {
    if (memo) return memo;
    memo = await getAlgoliaProductsHash();
    return memo;
  };
})();

export const getStaticPaths: GetStaticPaths = async () => {
  const productsHash = await getMemorizedData();

  const products = Object.values(productsHash);

  const paths = products ? products.map(product => `${ProductPagesPrefixes.ProductDetailsPage}/${product.slug}`) : [];

  return { paths, fallback: false };
};

export default CommonContainer;
