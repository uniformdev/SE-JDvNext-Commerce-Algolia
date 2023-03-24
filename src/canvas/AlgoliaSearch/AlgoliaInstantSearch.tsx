import React, { FC } from 'react';
import getConfig from 'next/config';
import { ComponentProps, UniformSlot, registerUniformComponent } from '@uniformdev/canvas-react';
import algoliasearch from 'algoliasearch/lite';
import { Configure, InstantSearch } from 'react-instantsearch-hooks-web';
import { ErrorPropertyCallout } from '../../components';
import { Container } from '../../components';

const {
  publicRuntimeConfig: { algoliaApplicationId, algoliaSearchKey },
} = getConfig();

const searchClient = algoliasearch(algoliaApplicationId, algoliaSearchKey);

type Props = {
  title?: string;
  rootCategory?: string;
  instantSearchParams?: {
    instantSearchProps?: {
      indexName: string;
      stalledSearchDelay?: number;
    };
  };
};

const AlgoliaInstantSearch: FC<ComponentProps<Props>> = ({ instantSearchParams, rootCategory, component }) => {
  const { instantSearchProps } = instantSearchParams || {};

  if (!instantSearchProps) {
    return (
      <Container>
        <ErrorPropertyCallout
          classNames="sm:m-8 m-6"
          title={`Property 'indexName' was not defined for ${component.type} component.`}
        />
      </Container>
    );
  }

  return (
    <Container key={`algolia-search-${rootCategory}`}>
      <div className="py-6 sm:py-8">
        <InstantSearch {...instantSearchProps} searchClient={searchClient}>
          <Configure facetFilters={`categories:${rootCategory}`} />
          <UniformSlot name="widgets" />
        </InstantSearch>
      </div>
    </Container>
  );
};

registerUniformComponent({
  type: 'algolia-instantSearch',
  component: AlgoliaInstantSearch,
});

export default AlgoliaInstantSearch;
