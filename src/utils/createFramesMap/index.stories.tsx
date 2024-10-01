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

export const MapCreationFromInput: Story = {
  render: () => {
    const [framesMap, setFramesMap] = useState<FramesMap>();
    const [imgUrl, setImgUrl] = useState('');
    const [data, setData] = useState<{
      numRows: number;
      numCols: number;
      image: Blob | undefined;
      imageExtension: string | undefined;
    }>({
      numRows: 0,
      numCols: 0,
      image: undefined,
      imageExtension: undefined,
    });

    const onInput: React.FormEventHandler<HTMLInputElement> = (event) => {
      const { name, value } = event.currentTarget;
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const onInputFile: React.FormEventHandler<HTMLInputElement> = (event) => {
      const file = event.currentTarget.files?.[0];

      if (file) {
        const image = new Blob([file], { type: file.type });
        const imageExtension = file.type.split('/')[1];
        setImgUrl(URL.createObjectURL(file));
        setData((prev) => ({
          ...prev,
          image,
          imageExtension,
        }));
      }
    };

    const generateMap = async () => {
      data.image &&
        data.imageExtension &&
        setFramesMap(
          await createFramesMap({
            image: data.image,
            imageExtension: data.imageExtension,
            numCols: data.numCols,
            numRows: data.numRows,
          })
        );
    };

    return (
      <div>
        <div>
          <label>Image</label>
          <input type="file" onInput={onInputFile} />
        </div>
        <div>
          <label>Rows</label>
          <input
            name="numRows"
            type="number"
            value={data.numRows}
            onInput={onInput}
          />
        </div>
        <div>
          <label>Columns</label>
          <input
            name="numCols"
            type="number"
            value={data.numCols}
            onInput={onInput}
          />
        </div>
        <button onClick={generateMap}>Generate Map</button>
        <img src={imgUrl} />
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
