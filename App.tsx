import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableWithoutFeedback, Image } from 'react-native';
import { formatTime } from './helpers/utils';
import { useFonts } from 'expo-font';
import ScoreCounter from './components/score_counter';
import TimerType from './components/timer_type';
import PeriodTracker from './components/period_tracker';
import Pause from './assets/icons/pause.png';
import Reset from './assets/icons/reset.png';
import Play from './assets/icons/play.png';
import { Audio } from 'expo-av';

export default function App() {
  // Set app variables
  const [timer, setTimer] = useState<number>(720);
  const [timerType, setTimerType] = useState<ITimerType>("Standard");
  const [shotClockTime, setShotClockTime] = useState<number>(24);
  const [currentPeriod, setCurrentPeriod] = useState<number>(0); // Track the current period being played (in standard mode).
  const [countDownActive, setCountDownActive] = useState<boolean>(false); // Track if any of the two timers are running.
  const [gameInProgress, setGameInProgress] = useState<boolean>(false); // Track if a game is being played. This could be if any of the timers are going or are paused.
  const [buzzerSound, setBuzzerSound] = useState<Audio.Sound | undefined>(undefined);

  // Load app fonts
  const [fontsLoaded] = useFonts({
    "SFUI": require("./assets/fonts/SFUIText-Regular.otf"),
    "SFUI-Bold": require('./assets/fonts/SFUIText-Bold.otf'),
    "SFUI-Light": require('./assets/fonts/SFUIText-Light.otf'),
    "SFUI-Medium": require('./assets/fonts/SFUIText-Medium.otf'),
    "SFUI-Semibold": require('./assets/fonts/SFUIText-Semibold.otf')
  });

  const playBuzzerSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require('./assets/sounds/buzzer.wav'));
    await sound.playAsync();
  }

  useEffect(() => {
    // Register Sounds
    (async () => {
      const { sound } = await Audio.Sound.createAsync(require('./assets/sounds/buzzer.wav'));
      setBuzzerSound(sound);
    })()
  }, []);

  useEffect(() => {
    let shotClockInterval: NodeJS.Timeout;
    let timerInterval: NodeJS.Timeout;
    if (countDownActive || (timerType === "Standard" && (countDownActive && gameInProgress))) {
      timerInterval = setInterval(() => {
        setTimer(time => time - 1);
      }, 1000);
      shotClockInterval = setInterval(() => {
        setShotClockTime(time => time - 0.1);
      }, 98);
    }

    return () => {
      clearInterval(shotClockInterval);
      clearInterval(timerInterval);
    }
  }, [gameInProgress, countDownActive]);

  useEffect(() => {
    if (timerType === "Custom") {
      setTimer(600);
    } else {
      setTimer(720);
    }
    setCountDownActive(false);
    setGameInProgress(false);
  }, [timerType]);

  useEffect(() => {
    if (shotClockTime <= 0) {
      buzzerSound?.playAsync();
      setCountDownActive(false);
      setShotClockTime(24);
    }
  }, [shotClockTime]);

  // Check if fonts were loaded correctly!
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className={`flex-1 bg-black relative`}>
      <StatusBar style="dark" backgroundColor='#000000' animated hidden />

      {timerType === "Standard" && (<PeriodTracker current_period={currentPeriod} />)}
      <TimerType type={timerType} setType={setTimerType} />

      <View className={`flex flex-col items-center justify-center w-full ios:pt-8 android:pt-5 pb-3`}>
        <Text className={`text-white font-sfui-bold text-[90px] tracking-widest`}>
          {formatTime(timer)}
        </Text>

        <Text className={`text-5xl mt-1 text-white font-sfui-semibold py-4`}>
          {shotClockTime.toLocaleString(undefined, { minimumFractionDigits: 1 })}
        </Text>
      </View>

      <View className={`flex flex-row items-center ios:mt-4 ios:px-5 android:px-14 justify-between`}>
        <ScoreCounter title='Home' setShotClockTime={setShotClockTime} />

        {(!countDownActive && !gameInProgress) && (
          <TouchableWithoutFeedback onPress={() => { setCountDownActive(true); setGameInProgress(true) }}>
            <View className={`rounded-full w-[70px] h-[70px] bg-green flex items-center justify-center`}>
              <Text className={`text-white font-sfui-semibold text-xl`}>
                Start
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}

        {(countDownActive || gameInProgress) && (
          <View className={`flex flex-row items-center`}>
            <TouchableWithoutFeedback
              onPress={() => {
                if (timerType === "Standard") {
                  setTimer(720);
                } else {
                  setTimer(600);
                }
                setShotClockTime(24);
                setCurrentPeriod(0);
                setGameInProgress(false);
                setCountDownActive(false);
              }}
            >
              <Image
                source={Reset}
                className={`w-[53px] h-[39.51px] mr-6`}
              />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => { setCountDownActive(!countDownActive); }}>
              <Image
                source={countDownActive ? Pause : Play}
                className={`w-[24px] h-[29px] mr-5`}
              />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => { setShotClockTime(time => time + 14) }}>
              <Text className={`text-green font-sfui-semibold text-[27px] leading-[32px]`}>
                +14
              </Text>
            </TouchableWithoutFeedback>
          </View>
        )}

        <ScoreCounter title='Away' setShotClockTime={setShotClockTime} />
      </View>
    </SafeAreaView>
  );
}
