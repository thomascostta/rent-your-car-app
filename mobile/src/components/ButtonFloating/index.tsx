import { Linking } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { MyCarsButton } from "./styles";
import WhatsAppIcon from "../../assets/whatsapp.svg";

interface Props {
  positionButton: {
    bottom: number;
    right: number;
  };
}

export function ButtonFloating({ positionButton }: Props) {
  const positionY = useSharedValue(0);
  const positionX = useSharedValue(0);

  const myCarsButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: positionX.value },
        { translateY: positionY.value },
      ],
    };
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onStart(_, ctx: any) {
      ctx.positionY = positionY.value;
      ctx.positionX = positionX.value;
    },
    onActive(event, ctx: any) {
      positionY.value = ctx.positionY + event.translationY;
      positionX.value = ctx.positionX + event.translationX;
    },
    onEnd() {
      positionX.value = withSpring(0);
      positionY.value = withSpring(0);
    },
  });

  function handleOpenWhatsApp() {
    Linking.canOpenURL("whatsapp://send?text=oi").then((supported) => {
      if (supported) {
        return Linking.openURL("whatsapp://send?phone=5511999999999&text=Olá");
      } else {
        return Linking.openURL(
          "https://api.whatsapp.com/send?phone=5511999999999&text=Olá"
        );
      }
    });
  }

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View
        style={[
          myCarsButtonStyle,
          {
            position: "absolute",
            bottom: positionButton.bottom,
            right: positionButton.right,
          },
        ]}
      >
        <MyCarsButton onPress={handleOpenWhatsApp}>
          <WhatsAppIcon width={40} height={40} />
        </MyCarsButton>
      </Animated.View>
    </PanGestureHandler>
  );
}
