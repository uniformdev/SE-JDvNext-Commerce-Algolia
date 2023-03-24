import { GetStaticProps, GetStaticPaths } from 'next';
import { CommonContainer } from '@/components';
import { getPathsFromProjectMap, getCompositionProps } from '@/utilities/canvas';
import { AppPages, DepthOfNavigationLinks, InternalCompositionSlugs, ProductPagesPrefixes } from '@/constants';

export const getStaticProps: GetStaticProps<{ preview?: boolean }> = async context => {
  const { preview, params } = context;
  const { category: queryCategory } = params || {};

  const category = String(queryCategory);

  return getCompositionProps({
    path: `${InternalCompositionSlugs.ProductListingPrefix}/${category}`,
    context,
    navigationLinkOptions: {
      depth: DepthOfNavigationLinks,
      skipPaths: [`${AppPages.Articles}/`, `${AppPages.Products}/`],
    },
  })
    .then(compositionProps => ({
      props: {
        ...compositionProps,
        key: category,
        preview: Boolean(preview),
        revalidate: Number.MAX_SAFE_INTEGER,
      },
    }))
    .catch(() => ({ notFound: true }));
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getPathsFromProjectMap({ path: ProductPagesPrefixes.ProductListPage });
  return { paths, fallback: false };
};

export default CommonContainer;
