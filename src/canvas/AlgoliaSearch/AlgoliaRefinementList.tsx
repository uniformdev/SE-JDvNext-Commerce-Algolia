import React, { FC, useCallback, useMemo } from 'react';
import { RefinementList, useInstantSearch } from 'react-instantsearch-hooks-web';
import { ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import { ErrorPropertyCallout } from '../../components';

interface RefinementListItem {
  value: string;
  label: string;
  highlighted?: string;
  count: number;
  isRefined: boolean;
}

type Props = {
  refinementListParams?: {
    refinementListProps?: {
      allowedIndex?: string;
      attribute: string;
      operator: 'and' | 'or';
      limit?: number;
      showMore?: boolean;
      showMoreLimit?: number;
      searchable?: boolean;
      searchablePlaceholder?: string;
      escapeFacetValues?: boolean;
    };
  };
};

const AlgoliaRefinementList: FC<ComponentProps<Props>> = ({ refinementListParams, component }) => {
  const { refinementListProps } = refinementListParams || {};
  const {
    indexUiState: { configure },
  } = useInstantSearch();

  const [, rootCategory] = useMemo(() => {
    const { facetFilters } = configure || {};
    if (configure?.facetFilters && !Array.isArray(facetFilters)) return (facetFilters as string)?.split(':');
    return [];
  }, [configure]);

  //TODO: Investigate is there a way to do by algolia standard functionality
  const transformItems = useCallback(
    (items: RefinementListItem[]) => {
      if (!rootCategory) return items;
      return items?.filter(item => item.label !== rootCategory);
    },
    [rootCategory]
  );

  if (!refinementListProps) {
    return (
      <ErrorPropertyCallout
        classNames="lg:mr-6 mt-2"
        title={`Property 'attribute' was not defined for ${component.type} component.`}
      />
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="pt-12 pr-10 inline-flex flex-col lg:w-full first:pt-2 min-h-[250px]">
        <span className="font-extrabold text-lg capitalize">{refinementListProps?.attribute}</span>
        <RefinementList
          {...refinementListProps}
          transformItems={transformItems}
          classNames={{
            item: 'mt-4 hover:opacity-30',
            checkbox: 'hidden',
            selectedItem: 'rounded whitespace-nowrap py-1.5 px-2 hover:opacity-30 text-white bg-black my-1',
            showMore: 'border-2 uppercase font-bold text-sm text-center px-8 py-2.5 my-2 hover:border-black',
            disabledShowMore: 'pointer-events-none opacity-60',
            label: 'cursor-pointer flex justify-between items-center pr-3',
            labelText: 'capitalize pr-4 flex-1',
            count: 'bg-gray-50 rounded-full px-2 text-black',
          }}
        />
      </div>
    </div>
  );
};

registerUniformComponent({
  type: 'algolia-refinementList',
  component: AlgoliaRefinementList,
});

export default AlgoliaRefinementList;
