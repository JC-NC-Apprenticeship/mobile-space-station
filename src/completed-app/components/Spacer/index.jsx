import React from 'react';
import { View } from 'react-native';

export const Spacer = ({ orientation = 'vertical', width = 16, height = 16 }) => {
  const style =
    orientation === 'vertical'
      ? {
          height,
        }
      : {
          width,
        };

  return <View style={style} />;
};
