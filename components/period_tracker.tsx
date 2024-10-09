import { View } from 'react-native';
import React from 'react';

const PeriodTracker = ({ current_period }: { current_period: number; }) => {
  return (
    <View className={`flex flex-row items-center justify-center absolute top-6 ios:left-7`}>
      {Array.from({ length: 4 }).map((_, index) => (
        <View
          className={`w-2 h-2 mx-1 rounded-full ${index <= current_period && "bg-red"} border-[0.5px] border-red`}
          key={index}
        />
      ))}
    </View>
  )
}

export default PeriodTracker;
