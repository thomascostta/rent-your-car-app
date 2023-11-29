import { TouchableOpacityProps } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import {
  Container,
  Details,
  Brand,
  Name,
  About,
  Rent,
  Period,
  Price,
  Type,
  CarImage,
} from './styles';

import { Car as ModelCar } from '../../database/model/Car';
import { getAcessoryIcon } from '../../utils/getAcessoryIcon';
import { formattedCurrencyBRL } from '../../utils/currencyBRL';

interface Props extends TouchableOpacityProps {
  data: ModelCar;
}

export function Car({ data, ...rest }: Props) {
  const netInfo = useNetInfo();
  const MotorIcon = getAcessoryIcon(data.fuel_type);

  return (
    <Container {...rest}>
      <Details>
        <Brand>{data.brand}</Brand>
        <Name>{data.name}</Name>

        <About>
          <Rent>
            <Period>{data.period}</Period>
            <Price>{`${
              netInfo.isConnected === true ? formattedCurrencyBRL(data.price) : '...'
            }`}</Price>
          </Rent>

          <Type>
            <MotorIcon />
          </Type>
        </About>
      </Details>

      <CarImage
        source={{
          uri: data.thumbnail,
        }}
        resizeMode="contain"
      />
    </Container>
  );
}
