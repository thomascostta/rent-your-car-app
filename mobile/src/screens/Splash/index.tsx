import { useEffect } from "react";
import { useNavigation, ParamListBase } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import BrandSvg from "../../assets/brand.svg";
import LogoSvg from "../../assets/logo.svg";
import { Container } from "./styles";
import { StatusBar } from "react-native";

export function Splash() {
  const splashAnimation = useSharedValue(0);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const brandStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(splashAnimation.value, [0, 50], [1, 0]),
      transform: [
        {
          translateX: interpolate(
            splashAnimation.value,
            [0, 50],
            [0, -50],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const logoStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(splashAnimation.value, [0, 25, 50], [0, 0.3, 1]),
      transform: [
        {
          translateX: interpolate(
            splashAnimation.value,
            [0, 50],
            [-50, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  function startApp() {
    navigation.navigate("SignIn");
  }

  useEffect(() => {
    let mounted = true;

    splashAnimation.value = withTiming(50, { duration: 1000 }, () => {
      if (mounted) {
        ("worklet");
        runOnJS(startApp)();
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Animated.View style={[brandStyle, { position: "absolute" }]}>
        <BrandSvg width={80} height={50} />
      </Animated.View>

      <Animated.View style={[logoStyle, { position: "absolute" }]}>
        <LogoSvg width={180} height={20} />
      </Animated.View>
    </Container>
  );
}
