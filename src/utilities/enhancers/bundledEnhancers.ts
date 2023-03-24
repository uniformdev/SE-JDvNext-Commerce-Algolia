import { RootComponentInstance } from '@uniformdev/canvas';
import { getEnhancers } from '@uniformdev/canvas-enhancers';
import { contentfulEntriesPostEnhancer, contentfulEntryPostEnhancer } from './cmsPostEnhancers/contentfulPostEnhancer';

const postEnhancers = new Map();
// Contentful post enhancer
postEnhancers.set('Contentful Entry', contentfulEntryPostEnhancer);
postEnhancers.set('Contentful Multi', contentfulEntriesPostEnhancer);
postEnhancers.set('Contentful Query', contentfulEntriesPostEnhancer);

export const getBundledEnhancers = (composition: RootComponentInstance) => getEnhancers({ composition }, postEnhancers);
