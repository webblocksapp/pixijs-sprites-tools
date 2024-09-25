import { Meta, StoryObj } from '@storybook/react';
import { ShinobiSprite } from '@examples/components/ShinobiSprite';

const meta: Meta<typeof ShinobiSprite> = {
  title: 'Components/ShinobiSprite',
  component: ShinobiSprite,
};

type Story = StoryObj<typeof ShinobiSprite>;
export default meta;

export const Overview: Story = {};
