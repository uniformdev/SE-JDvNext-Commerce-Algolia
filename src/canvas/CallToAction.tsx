import { FC } from 'react';
import { ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import Container, { PaddingSize } from '../components/Container';
import Button from '../components/Button';
import { withContent } from '../hocs/withContent';

type CallToActionProps = ComponentProps<{
  title: string;
  text: string;
  buttonCopy?: string;
  buttonLink?: string;
}>;

const CallToAction: FC<CallToActionProps> = ({ title, text, buttonCopy, buttonLink }) => (
  <Container paddingTop={PaddingSize.Large} paddingBottom={PaddingSize.Large}>
    <div className="md:w-9/12 m-auto">
      {title && <p className="md:text-center font-bold text-4xl">{title}</p>}
      <p className="md:text-center mt-6">{text}</p>
      {buttonCopy && buttonLink && (
        <Button.Link href={buttonLink} styleType="primary" ariaLabel={buttonCopy} className="mt-8 px-4">
          <span>{buttonCopy}</span>
        </Button.Link>
      )}
    </div>
  </Container>
);

registerUniformComponent({
  type: 'callToAction',
  component: withContent(CallToAction),
});

export default CallToAction;
