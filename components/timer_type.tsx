import { View, Text, TouchableWithoutFeedback } from 'react-native';
import React, { Dispatch, SetStateAction } from 'react';

const TimerType = ({ type, setType }: { type: ITimerType, setType: Dispatch<SetStateAction<ITimerType>> }) => {
  return (
    <View className={`border border-grey rounded-lg h-8 absolute right-6 top-3 flex items-center flex-row overflow-hidden`}>
      <TouchableWithoutFeedback onPress={() => { setType("Standard") }}>
        <View className={`${type==="Standard" && "bg-green-a50"} h-full flex items-center justify-center`}>
          <Text className={`text-white ${type === "Standard" ? "opacity-100" : "opacity-30"} font-sfui-semibold px-3`}>
            Standard
          </Text>
        </View>
      </TouchableWithoutFeedback>

      <View className={`h-full bg-grey w-[1px]`} />

      <TouchableWithoutFeedback onPress={() => { setType("Custom") }}>
        <View className={`${type==="Custom" && "bg-green-a50"} h-full flex items-center justify-center`}>
          <Text className={`text-white ${type === "Custom" ? "opacity-100" : "opacity-30"} font-sfui-semibold px-3`}>
            Custom
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default TimerType;
