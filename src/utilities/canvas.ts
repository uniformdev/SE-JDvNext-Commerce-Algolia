import getConfig from 'next/config';
import {
  CanvasClient,
  CANVAS_PUBLISHED_STATE,
  CANVAS_DRAFT_STATE,
  RootComponentInstance,
  EnhancerBuilder,
} from '@uniformdev/canvas';
import { ProjectMapClient, ProjectMapNodeGetRequest, ProjectMapSubtree } from '@uniformdev/project-map';
import { enhanceComposition } from './enhanceComposition';

interface GetProjectMapOptions extends Omit<ProjectMapNodeGetRequest, 'projectId' | 'projectMapId'> {
  skipPaths?: string[];
}

const { uniformApiKey, uniformProjectId, uniformCliBaseUrl, uniformEdgeApiHost } = getConfig().serverRuntimeConfig;

const { canvasClient, projectMapClient } = (() => {
  if (!uniformApiKey || !uniformProjectId || !uniformCliBaseUrl || !uniformEdgeApiHost)
    throw Error('Uniform credentials must be specified');
  const clientOptions = {
    apiKey: uniformApiKey,
    apiHost: uniformCliBaseUrl,
    projectId: uniformProjectId,
  };
  return {
    canvasClient: new CanvasClient({ edgeApiHost: uniformEdgeApiHost, ...clientOptions }),
    projectMapClient: new ProjectMapClient(clientOptions),
  };
})();

const getState = (preview: boolean | undefined) => (preview ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE);

export const getCompositionProps = async ({
  path,
  defaultPath,
  context,
  navigationLinkOptions,
  preEnhancer,
  extendEnhancer,
}: {
  path: string;
  defaultPath?: string;
  context: { preview?: boolean };
  navigationLinkOptions?: GetProjectMapOptions;
  preEnhancer?: EnhancerBuilder; // Commerce apps, pdp pages must replace canvas selected product id by id from url.
  extendEnhancer?: (enhancer: EnhancerBuilder) => void; // Additional (app/route specific) enhancers for main enhance process
}): Promise<{ composition: RootComponentInstance; navigationLinks: Type.NavigationLink[] }> => {
  if (!path) throw new Error('Composition path is not provided');
  if (!canvasClient) throw new Error('Canvas client is not configured');

  const { preview } = context || {};

  // 1. fetch canvas composition by node path
  const { composition } = await canvasClient
    .getCompositionByNodePath({ projectMapNodePath: path, state: getState(preview), unstable_resolveData: true })
    .catch(e => {
      if (e.statusCode !== 404 || !defaultPath) throw e;
      return canvasClient.getCompositionByNodePath({
        projectMapNodePath: defaultPath,
        state: getState(preview),
        unstable_resolveData: true,
      });
    });

  // 2. enhance composition using bundledEnhancer extended with canvasComponentEnhancer and customEnhancer
  await enhanceComposition({ composition, preEnhancer, extendEnhancer });

  // 3. fetch navigation link using Project Map Client
  const navigationLinks = navigationLinkOptions ? await getLinksFromProjectMap(navigationLinkOptions) : [];

  return { composition, navigationLinks };
};

/* Official documentation https://docs.uniform.app/reference/packages/uniformdev-project-map#projectmapclient */
const getHeadProjectMaps = async (
  option: Omit<ProjectMapNodeGetRequest, 'projectId'>
): Promise<Type.NavigationLink[]> => {
  if (!projectMapClient) throw new Error('ProjectMapClient client is not configured');
  const { projectMaps } = await projectMapClient.getProjectMapDefinitions().catch(() => ({ projectMaps: [] }));
  const { id: projectMapId } = projectMaps[0] || {};
  if (!projectMapId) return [];

  return await projectMapClient
    .getSubtree(option)
    .then((projectMapTree: ProjectMapSubtree | undefined) => {
      if (!projectMapTree) return [];
      const headProjectMaps: Type.NavigationLink[] = [];

      (function pushPath(projectMap: ProjectMapSubtree) {
        if (projectMap.type !== 'placeholder') {
          headProjectMaps.push({ title: projectMap.name, link: projectMap.path });
        }
        const { children = [] } = projectMap || {};
        children.forEach(pushPath);
      })(projectMapTree);

      return headProjectMaps;
    })
    .catch(() => []);
};

export const getPathsFromProjectMap = async (options?: GetProjectMapOptions): Promise<string[]> => {
  const { skipPaths, ...restOptions } = options || {};
  const paths = (await getHeadProjectMaps({ ...restOptions })).map(projectMap => projectMap.link);
  return skipPaths ? paths.filter(path => !skipPaths.some(skip => path.includes(skip))) : paths;
};

export const getLinksFromProjectMap = async (options?: GetProjectMapOptions): Promise<Type.NavigationLink[]> => {
  const { skipPaths, ...restOptions } = options || {};
  const links = await getHeadProjectMaps({ ...restOptions });
  return skipPaths ? links.filter(path => !skipPaths.some(skip => path.link.includes(skip))) : links;
};
