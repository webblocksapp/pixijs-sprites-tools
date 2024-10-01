import { Meta, StoryObj } from '@storybook/react';
import { base64ToBlob } from '@utils/base64ToBlob';
import { getImageDimensions } from '@utils/getImageDimensions';
import { image } from './mocks';
import { useEffect, useState } from 'react';

const meta: Meta<typeof getImageDimensions> = {
  title: 'Utils/getImageDimensions',
};

type Story = StoryObj<typeof getImageDimensions>;
export default meta;

export const Overview: Story = {
  render: () => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
      (async () => {
        setDimensions(
          await getImageDimensions(base64ToBlob(image, 'image/png'))
        );
      })();
    }, []);

    return <>{JSON.stringify(dimensions)}</>;
  },
};
