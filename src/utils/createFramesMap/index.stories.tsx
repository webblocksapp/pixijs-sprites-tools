import { Meta, StoryObj } from '@storybook/react';
import { createFramesMap } from '@utils/createFramesMap';
import { image1 } from './mocks';
import { useEffect, useState } from 'react';
import { FramesMap } from '@interfaces/FramesMap';
import { base64ToBlob } from '@utils/base64ToBlob';

const meta: Meta<typeof createFramesMap> = {
  title: 'Utils/createFramesMap',
};

type Story = StoryObj<typeof createFramesMap>;
export default meta;

export const Overview: Story = {
  render: () => {
    const [framesMap, setFramesMap] = useState<FramesMap>();

    useEffect(() => {
      (async () => {
        setFramesMap(
          await createFramesMap({
            image: base64ToBlob(image1, 'image/png'),
            imageExtension: 'png',
            numCols: 6,
            numRows: 1,
          })
        );
      })();
    }, []);

    return (
      <div style={{ display: 'flex' }}>
        <div>
          <p>Demo Image:</p>
          <img src={`data:image/png;base64,${image1}`} />
        </div>
        <div>
          <p>Frames map:</p>
          <code>
            <pre>{JSON.stringify(framesMap, null, 2)}</pre>
          </code>
        </div>
      </div>
    );
  },
};
