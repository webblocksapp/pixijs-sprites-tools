import { Meta, StoryObj } from '@storybook/react';
import { createFramesMap } from '@utils/createFramesMap';
import { image1 } from './mocks';
import { useEffect, useRef, useState } from 'react';
import { FramesMap } from '@interfaces/FramesMap';
import { base64ToBlob } from '@utils/base64ToBlob';
import { Application } from 'pixi.js';
import { createSprite } from '@utils/createSprite';

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
            imageUrl: 'main.png',
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
    const pixiContainer = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application | null>(null);
    const [framesMap, setFramesMap] = useState<FramesMap>();
    const [framesMapUrl, setFramesMapUrl] = useState<string>('');
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
            imageUrl: imgUrl,
            numCols: data.numCols,
            numRows: data.numRows,
          })
        );
    };

    const cleanScene = () => {
      if (appRef.current) {
        if (pixiContainer.current && appRef.current.canvas) {
          pixiContainer.current.removeChild(appRef.current.canvas);
          appRef.current.destroy(true, { children: true });
        }
        appRef.current = null;
      }
    };

    const startScene = async () => {
      const app = new Application();
      await app.init({
        backgroundColor: 'pink',
        width: 300,
        height: 300,
      });
      appRef.current = app;

      if (pixiContainer.current) {
        pixiContainer.current.appendChild(app.canvas);
      }
    };

    useEffect(() => {
      if (framesMap) {
        const jsonString = JSON.stringify(framesMap, null, 2); // Pretty-print with 2 spaces
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        setFramesMapUrl(url);
      }
    }, [framesMap]);

    const initializePixiContainer = () => {
      const sprite = createSprite(
        {
          assets: [
            {
              label: 'Any animation',
              framesMap,
              animations: [
                {
                  speed: 0.2,
                  default: true,
                },
              ],
            },
          ],
        },
        { debug: true }
      );
      (async () => {
        cleanScene();
        await startScene();
        await sprite.initialize();
        if (appRef.current && sprite.data.anim) {
          appRef.current.stage.addChild(sprite.data.anim);
          sprite.data.anim.x = appRef.current!.screen.width / 2;
          sprite.data.anim.y = appRef.current!.screen.height / 2;
        }
        sprite.initEventListeners();
        sprite.onKeyLogsChange((logs) => {
          console.log(logs);
        });
      })();
      return () => {
        sprite.removeEventListeners();
      };
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
        {framesMap ? (
          <div style={{ display: 'flex' }}>
            <div>
              <p>Frames map:</p>
              <span>Url: {framesMapUrl}</span>
              <code>
                <pre>{JSON.stringify(framesMap, null, 2)}</pre>
              </code>
            </div>
            <div>
              <p>Preview animation:</p>
              <button onClick={initializePixiContainer}>Preview</button>
              <div
                ref={pixiContainer}
                style={{ width: 300, height: 300, border: '1px solid black' }}
              />
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  },
};
