import {
  ParamListBase,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useWindowDimensions } from 'react-native';
import { Container, Title, Content, Message, Footer } from './styles';

import LogoSVG from '../../assets/logo_background_gray.svg';
import DoneSVG from '../../assets/done.svg';
import { ConfirmButton } from '../../components/ConfirmButton';

interface Params {
  title: string;
  message: string;
  nextScreenRoute: string;
}

export function Confirmation() {
  const route = useRoute();
  const { width } = useWindowDimensions();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { message, nextScreenRoute, title } = route.params as Params;

  function handleConfirm() {
    navigation.navigate(nextScreenRoute);
  }

  return (
    <Container>
      <LogoSVG width={width} />

      <Content>
        <DoneSVG width={80} height={80} />
        <Title>{title}</Title>

        <Message>{message}</Message>
      </Content>

      <Footer>
        <ConfirmButton title="Ok" onPress={handleConfirm} />
      </Footer>
    </Container>
  );
}
