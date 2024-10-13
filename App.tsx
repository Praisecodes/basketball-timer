import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableWithoutFeedback, Image, Vibration, Platform } from 'react-native';
import { formatTime } from './helpers/utils';
import { useFonts } from 'expo-font';
import ScoreCounter from './components/score_counter';
import TimerType from './components/timer_type';
import PeriodTracker from './components/period_tracker';
import Pause from './assets/icons/pause.png';
import Reset from './assets/icons/reset.png';
import Play from './assets/icons/play.png';
import { Audio } from 'expo-av';
import GameType from './components/game_type';

export default function App() {
  // Set app variables
  const [timer, setTimer] = useState<number>(720);
  const [selectedTime, setSelectedTime] = useState<number>(720); // Time agreed upon to play game.
  const [timerType, setTimerType] = useState<ITimerType>("Standard");
  const [shotClockTime, setShotClockTime] = useState<number>(24);
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [currentPeriod, setCurrentPeriod] = useState<number>(0); // Track the current period being played (in standard mode).
  const [countDownActive, setCountDownActive] = useState<boolean>(false); // Track if any of the two timers are running.
  const [gameInProgress, setGameInProgress] = useState<boolean>(false); // Track if a game is being played. This could be if any of the timers are going or are paused.
  const [buzzerSound, setBuzzerSound] = useState<Audio.Sound | undefined>(undefined);
  const [whistleSound, setWhistleSound] = useState<Audio.Sound | undefined>(undefined);
  const [gameType, setGameType] = useState<IGameType>("5x5"); // Full-court or Half-court

  // Load app fonts
  const [fontsLoaded] = useFonts({
    "SFUI": require("./assets/fonts/SFUIText-Regular.otf"),
    "SFUI-Bold": require('./assets/fonts/SFUIText-Bold.otf'),
    "SFUI-Light": require('./assets/fonts/SFUIText-Light.otf'),
    "SFUI-Medium": require('./assets/fonts/SFUIText-Medium.otf'),
    "SFUI-Semibold": require('./assets/fonts/SFUIText-Semibold.otf')
  });

  const resetGame = () => {
    if (timerType === "Standard") {
      setTimer(720);
    } else {
      setTimer(selectedTime);
    }
    setShotClockTime(gameType === "5x5" ? 24 : 12);
    setCurrentPeriod(0);
    setGameInProgress(false);
    setCountDownActive(false);
    setHomeScore(0);
    setAwayScore(0);
  }

  const handleTimerEllapse = async () => {
    if (timer <= 0) {
      await buzzerSound?.replayAsync();
      Vibration.vibrate(
        2000,
        false
      );
      setCountDownActive(false);
      setTimer(timerType === "Standard" ? 720 : selectedTime);
      if (timerType === "Standard" && currentPeriod < 3) {
        setCurrentPeriod(period => period + 1);
      } else if (timerType === "Custom") {
        resetGame();
      }
      setShotClockTime(gameType === "5x5" ? 24 : 12);
    }
  }

  const handleShotClockEllapse = async () => {
    if (shotClockTime <= 0) {
      await whistleSound?.replayAsync();
      Vibration.vibrate(300, false);
      setCountDownActive(false);
      setShotClockTime(gameType === "5x5" ? 24 : 12);
    }
  }

  useEffect(() => {
    // Register Sounds
    (async () => {
      const { sound } = await Audio.Sound.createAsync(require('./assets/sounds/buzzer.wav'));
      const { sound: WHISTLE_SOUND } = await Audio.Sound.createAsync(require('./assets/sounds/whistle.wav'));
      setWhistleSound(WHISTLE_SOUND);
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
      if (gameType === "5x5") {
        setTimer(600);
        setSelectedTime(600);
        setShotClockTime(24);
      } else {
        setTimer(300);
        setSelectedTime(300);
        setShotClockTime(12);
      }
    } else {
      setTimer(720);
      setSelectedTime(720);
      setShotClockTime(24);
      setGameType("5x5");
    }
    setCountDownActive(false);
    setGameInProgress(false);
  }, [timerType, gameType]);

  useEffect(() => {
    if (currentPeriod === 3) {
      resetGame();
    }
  }, [currentPeriod]);

  useEffect(() => {
    handleShotClockEllapse();
  }, [shotClockTime]);

  useEffect(() => {
    handleTimerEllapse();
  }, [timer]);

  // Check if fonts were loaded correctly!
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView className={`flex-1 bg-black relative`}>
      <StatusBar style="dark" backgroundColor='#000000' animated hidden />

      {timerType === "Custom" && (<GameType type={gameType} setType={setGameType} disabled={gameInProgress} />)}

      {timerType === "Standard" && (<PeriodTracker current_period={currentPeriod} />)}
      <TimerType disabled={gameInProgress} type={timerType} setType={setTimerType} />

      <View className={`flex flex-col items-center justify-center w-full ios:pt-8 android:pt-5 pb-3`}>
        <View className={`flex flex-row items-center`}>
          <TouchableWithoutFeedback onPress={() => { !gameInProgress && setTimer(time => time - 60); setSelectedTime(time => time - 60); }}>
            <Text className={`font-sfui-bold text-[90px] text-red mr-6`}>
              -
            </Text>
          </TouchableWithoutFeedback>

          <Text className={`text-white font-sfui-bold text-[90px] tracking-widest`}>
            {formatTime(timer)}
          </Text>

          <TouchableWithoutFeedback onPress={() => { !countDownActive && setTimer(time => time + 60); setSelectedTime(time => time + 60); }}>
            <Text className={`font-sfui-bold text-[70px] text-green -mt-1 ml-5`}>
              +
            </Text>
          </TouchableWithoutFeedback>
        </View>

        <TouchableWithoutFeedback onPress={() => { setShotClockTime(gameType === "5x5" ? 24 : 12) }}>
          <Text className={`text-5xl mt-1 text-white font-sfui-semibold py-4`}>
            {shotClockTime.toLocaleString(undefined, { minimumFractionDigits: 1 })}
          </Text>
        </TouchableWithoutFeedback>
      </View>

      <View className={`flex flex-row items-center ios:mt-4 ios:px-5 android:px-14 justify-between`}>
        <ScoreCounter
          title='Home'
          gameType={gameType}
          score={homeScore}
          setScore={setHomeScore}
          setShotClockTime={setShotClockTime}
        />

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
            <TouchableWithoutFeedback onPress={resetGame}>
              <Image
                source={Reset}
                className={`w-[52px] h-[39.51px] mr-6`}
              />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => { setCountDownActive(!countDownActive); }}>
              <Image
                source={countDownActive ? Pause : Play}
                className={`w-[24px] h-[29px] mr-5`}
              />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => { gameType === "5x5" ? setShotClockTime(time => time + 14) : setShotClockTime(time => time + 7) }}>
              <Text className={`text-green font-sfui-semibold text-[27px] leading-[32px]`}>
                {gameType === "5x5" ? "+14" : "+7"}
              </Text>
            </TouchableWithoutFeedback>
          </View>
        )}

        <ScoreCounter
          title='Away'
          gameType={gameType}
          score={awayScore}
          setScore={setAwayScore}
          setShotClockTime={setShotClockTime}
        />
      </View>
    </SafeAreaView>
  );
}
