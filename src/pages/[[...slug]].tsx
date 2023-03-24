import { GetStaticProps, GetStaticPaths } from 'next';
import { CommonContainer } from '@/components';
import { getFormattedPath } from '@/utilities';
import { getPathsFromProjectMap, getCompositionProps } from '@/utilities/canvas';
import { AppPages, DepthOfNavigationLinks, ProductPagesPrefixes } from '@/constants';

export const getStaticProps: GetStaticProps<{ preview?: boolean }> = async context => {
  const { preview, params } = context;
  const { slug: initialSlug } = params || {};

  const path = getFormattedPath(AppPages.Home, initialSlug);

  return getCompositionProps({
    path,
    context,
    navigationLinkOptions: {
      depth: DepthOfNavigationLinks,
      skipPaths: [`${AppPages.Articles}/`, `${AppPages.Products}/`],
    },
  })
    .then(compositionProps => ({
      props: {
        ...compositionProps,
        preview: Boolean(preview),
        revalidate: Number.MAX_SAFE_INTEGER,
      },
    }))
    .catch(() => ({ notFound: true }));
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getPathsFromProjectMap({ skipPaths: [ProductPagesPrefixes.ProductListPage], depth: 1 });
  return { paths, fallback: false };
};

export default CommonContainer;
