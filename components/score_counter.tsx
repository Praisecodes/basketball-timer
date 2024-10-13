import { View, Text, TouchableWithoutFeedback, Image } from 'react-native';
import React, { Dispatch, SetStateAction, useState } from 'react';
import Undo from '../assets/icons/undo.png';

const ScoreCounter = ({ title, setShotClockTime, gameType, score, setScore }: { title: string; setShotClockTime: Dispatch<SetStateAction<number>>; gameType: IGameType; score: number; setScore: Dispatch<SetStateAction<number>>; }) => {
  const [lastPointUpdate, setLastPointUpdate] = useState<number>(0);
  const [undoIsActive, setUndoIsActive] = useState<boolean>(false);

  return (
    <View className={`flex flex-row items-center`}>
      <View className={`self-end mb-3.5`}>
        <TouchableWithoutFeedback onPress={() => {
          if (undoIsActive) {
            setScore(score => score - lastPointUpdate);
            setUndoIsActive(false);
          }
        }}>
          <Image
            source={Undo}
            className={`w-[17.2px] h-[20.3px] mr-2`}
          />
        </TouchableWithoutFeedback>
      </View>

      <View className={`flex flex-col items-center justify-center mx-2`}>
        <Text className={`text-white font-sfui-bold text-2xl`}>
          {title}
        </Text>

        <View className={`mt-1`}>
          <Text className={`font-sfui-bold text-[70px] tracking-tight text-white`}>
            {score.toLocaleString(undefined, { minimumIntegerDigits: 2 })}
          </Text>
        </View>
      </View>

      <View className={`ml-2`}>
        <TouchableWithoutFeedback onPress={() => {
          setScore(score => score + 1);
          setLastPointUpdate(1);
          setUndoIsActive(true);
          setShotClockTime(gameType === "5x5" ? 24 : 12);
        }}>
          <Text className={`text-green text-xl p-1 font-sfui-semibold`}>
            +1
          </Text>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => {
          setScore(score => score + 2);
          setLastPointUpdate(2);
          setUndoIsActive(true);
          setShotClockTime(gameType === "5x5" ? 24 : 12);
        }}>
          <Text className={`text-green mt-1 p-1 text-xl font-sfui-semibold`}>
            +2
          </Text>
        </TouchableWithoutFeedback>

        {gameType === "5x5" && (
          <TouchableWithoutFeedback onPress={() => {
            setScore(score => score + 3);
            setLastPointUpdate(3);
            setUndoIsActive(true);
            setShotClockTime(gameType === "5x5" ? 24 : 12);
          }}>
            <Text className={`text-green mt-1 p-1 text-xl font-sfui-semibold`}>
              +3
            </Text>
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  )
}

export default ScoreCounter;
