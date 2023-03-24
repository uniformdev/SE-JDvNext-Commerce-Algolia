import { EnhancerBuilder } from '@uniformdev/canvas';
import { EnhanceParameter, getFormattedLink } from '../index';

const projectMapLinkTransformer = ({
  parameter,
}: EnhanceParameter<{
  path: string;
  nodeId: string;
  projectMapId: string;
}>) => parameter.value.path;

const backgroundImageTransformer = ({ parameter }: EnhanceParameter<string>) => getFormattedLink(parameter.value);

export const extendEnhancerByCanvasComponents = (enhancer: EnhancerBuilder) => {
  enhancer
    .parameterType('link', { enhanceOne: projectMapLinkTransformer })
    .parameterName(['backgroundImage', 'image', 'successfulSubmitImage', 'errorSubmitImage'], {
      enhanceOne: backgroundImageTransformer,
    });
};
