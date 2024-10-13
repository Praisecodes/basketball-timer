import { View, Text, TouchableWithoutFeedback } from 'react-native';
import React, { Dispatch, SetStateAction } from 'react';

const GameType = ({ type, setType, disabled }: { type: IGameType; setType: Dispatch<SetStateAction<IGameType>>; disabled: boolean; }) => {
  return (
    <View className={`border border-grey rounded-lg h-8 absolute left-6 top-3 z-50 flex items-center flex-row overflow-hidden`}>
      <TouchableWithoutFeedback onPress={() => { !disabled && setType("5x5") }}>
        <View className={`${type === "5x5" && "bg-green-a50"} h-full flex items-center justify-center`}>
          <Text className={`text-white ${type === "5x5" ? "opacity-100" : "opacity-30"} font-sfui-semibold px-4`}>
            5x5
          </Text>
        </View>
      </TouchableWithoutFeedback>

      <View className={`h-full bg-grey w-[1px]`} />

      <TouchableWithoutFeedback onPress={() => { !disabled && setType("3x3") }}>
        <View className={`${type === "3x3" && "bg-green-a50"} h-full flex items-center justify-center`}>
          <Text className={`text-white ${type === "3x3" ? "opacity-100" : "opacity-30"} font-sfui-semibold px-4`}>
            3x3
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default GameType;
