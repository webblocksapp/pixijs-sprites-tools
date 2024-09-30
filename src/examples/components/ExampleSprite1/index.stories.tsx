import { Meta, StoryObj } from '@storybook/react';
import { ExampleSprite1 } from '@examples/components/ExampleSprite1';

const meta: Meta<typeof ExampleSprite1> = {
  title: 'Components/ExampleSprite1',
  component: ExampleSprite1,
};

type Story = StoryObj<typeof ExampleSprite1>;
export default meta;

export const Overview: Story = {};
