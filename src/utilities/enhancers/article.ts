import { ChildEnhancerBuilder, enhance, EnhancerBuilder } from '@uniformdev/canvas';
import { EnhanceParameter } from '../index';
import { getCompositionProps } from '../canvas';

const getArticleComponentParameterEnhancer = (article: Type.Article) => (builder: ChildEnhancerBuilder) => {
  builder.data('content', () => article);
};

export const enhancerCustomExtenderFactory = (article: Type.Article) => (enhancer: EnhancerBuilder) => {
  enhancer.component('article', getArticleComponentParameterEnhancer(article));
};

const getAllArticles =
  (articlesHashMapper: { [name: string]: unknown }) =>
  ({ parameter }: EnhanceParameter<{ slug: string }[]>) =>
    parameter.value.forEach(article => {
      articlesHashMapper[article.slug] = article;
    });

export const getArticles = async (
  preview: boolean,
  path: string,
  parameterType: string[]
): Promise<{ [name: string]: Type.Article } | null> =>
  getCompositionProps({ path, context: { preview } })
    .then(({ composition }) => {
      const articlesHashMapper = {};
      return enhance({
        composition,
        enhancers: new EnhancerBuilder().parameterType(parameterType, {
          enhanceOne: getAllArticles(articlesHashMapper),
        }),
        context: { preview },
      })
        .then(() => articlesHashMapper)
        .catch(() => null);
    })
    .catch(() => null);
