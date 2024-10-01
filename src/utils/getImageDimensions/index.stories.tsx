import { Meta, StoryObj } from '@storybook/react';
import { base64ToBlob } from '@utils/base64ToBlob';
import { getImageDimensions } from '@utils/getImageDimensions';
import { image1, image2 } from './mocks';
import { useEffect, useState } from 'react';

const meta: Meta<typeof getImageDimensions> = {
  title: 'Utils/getImageDimensions',
};

type Story = StoryObj<typeof getImageDimensions>;
export default meta;

export const Overview: Story = {
  render: () => {
    const [dimensions1, setDimensions1] = useState({ width: 0, height: 0 });
    const [dimensions2, setDimensions2] = useState({ width: 0, height: 0 });

    useEffect(() => {
      (async () => {
        setDimensions1(
          await getImageDimensions(base64ToBlob(image1, 'image/png'))
        );
        setDimensions2(
          await getImageDimensions(base64ToBlob(image2, 'image/png'))
        );
      })();
    }, []);

    return (
      <div>
        <p>Image 1: {JSON.stringify(dimensions1)}</p>
        <p>Image 2: {JSON.stringify(dimensions2)}</p>
      </div>
    );
  },
};
