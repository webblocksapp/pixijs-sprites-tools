import { Meta, StoryObj } from '@storybook/react';
import { RunningDogSprite } from '@examples/components/RunningDogSprite';

const meta: Meta<typeof RunningDogSprite> = {
  title: 'Components/RunningDogSprite',
  component: RunningDogSprite,
};

type Story = StoryObj<typeof RunningDogSprite>;
export default meta;

export const Overview: Story = {};
