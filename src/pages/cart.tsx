import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { getLinksFromProjectMap } from '@/utilities/canvas';
import { DepthOfNavigationLinks, AppPages } from '@/constants';

const ShoppingCart = dynamic(() => import('@/components').then(com => com.ShoppingCart), { ssr: false });

export const getStaticProps: GetStaticProps<{ preview?: boolean }> = async context => {
  const { preview } = context;
  const navigationLinks = await getLinksFromProjectMap({
    depth: DepthOfNavigationLinks,
    skipPaths: [`${AppPages.Articles}/`, `${AppPages.Products}/`],
  });
  return {
    props: {
      preview: Boolean(preview),
      revalidate: Number.MAX_SAFE_INTEGER,
      navigationLinks,
    },
  };
};

export default ShoppingCart;
