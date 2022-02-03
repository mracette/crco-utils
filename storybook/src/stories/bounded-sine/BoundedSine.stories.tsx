import React from "react";
import { ComponentMeta } from "@storybook/react";
import { BoundedSine, BoundedSineProps } from "./BoundedSine";

const meta = {
  title: "Bounded Sine",
  component: BoundedSine,
  argTypes: {
    yStart: {
      defaultValue: 0,
      control: {
        type: "range",
        min: -5,
        max: 5
      }
    },
    period: {
      defaultValue: 1,
      control: { type: "range", min: 1, max: 10 }
    },
    yMin: {
      defaultValue: -5,
      control: { type: "range", min: -15, max: -5 }
    },
    yMax: { defaultValue: 5, control: { type: "range", min: 5, max: 15 } },
    translateX: {
      defaultValue: 0,
      control: { type: "range", min: -10, max: 10, step: 0.01 }
    },
    translateY: { defaultValue: 0, control: { type: "range", min: -10, max: 10 } },
    invert: { defaultValue: false }
  }
} as ComponentMeta<typeof BoundedSine>;

const Template = (args: BoundedSineProps) => <BoundedSine {...args} />;

export const Default = Template.bind({});

export default meta;
