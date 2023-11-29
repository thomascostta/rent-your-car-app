import { useEffect, useState } from "react";
import {
  ParamListBase,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Alert, StatusBar } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "styled-components";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { format } from "date-fns";
import { useNetInfo } from "@react-native-community/netinfo";

import { api } from "../../services/api";

import { Accessory } from "../../components/Accessory";
import { Button } from "../../components/Button";
import { BackButton } from "../../components/BackButton";
import { ImageSlider } from "../../components/ImageSlider";
import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Accessories,
  Footer,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  ReantalPriceTotal,
} from "./styles";

import { getAcessoryIcon } from "../../utils/getAcessoryIcon";
import { getPlatformDate } from "../../utils/getPlataformDate";
import { CarDTO } from "../../dtos/carDTO";
import { formattedCurrencyBRL } from "../../utils/currencyBRL";

interface Params {
  car: CarDTO;
  dates: string[];
}

interface RentalPeriod {
  start: string;
  end: string;
}

export function SchedulingDetails() {
  const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);
  const [loading, setLoading] = useState(true);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>(
    {} as RentalPeriod
  );

  const netInfo = useNetInfo();
  const route = useRoute();
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { car, dates } = route.params as Params;

  const rentTotal = Number(dates.length * car.price);

  async function handleConfirm() {
    setLoading(true);

    await api
      .post(`rentals`, {
        user_id: 1,
        car_id: car.id,
        start_date: new Date(dates[0]),
        end_date: new Date(dates[dates.length - 1]),
        total: rentTotal,
      })
      .then(() => {
        navigation.navigate("Confirmation", {
          nextScreenRoute: "HomeStack",
          title: "Carro alugado!",
          message: `Agora você só precisa ir \n até a concessionária da RENTX\n e pegar o seu automóvel.`,
        });
      })
      .catch(() => {
        Alert.alert("Não foi possível confirmar o agendamento");
      });
  }

  useEffect(() => {
    setRentalPeriod({
      start: format(getPlatformDate(new Date(dates[0])), "dd/MM/yyyy"),
      end: format(
        getPlatformDate(new Date(dates[dates.length - 1])),
        "dd/MM/yyyy"
      ),
    });
  }, []);

  useEffect(() => {
    async function fetchCarUpdated() {
      const response = await api.get(`/cars/${car.id}`);
      setCarUpdated(response.data);
    }
    if (netInfo.isConnected === true) fetchCarUpdated();
  }, [netInfo.isConnected]);

  return (
    <Container>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <Header>
        <BackButton onPress={() => navigation.goBack()} />
      </Header>

      <CarImages>
        <ImageSlider
          imagesUrl={
            carUpdated.photos
              ? carUpdated.photos
              : [{ id: car.thumbnail, photo: car.thumbnail }]
          }
        />
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.period}</Period>
            <Price>{formattedCurrencyBRL(car.price)}</Price>
          </Rent>
        </Details>

        {carUpdated.accessories && (
          <Accessories>
            {carUpdated.accessories.map((acessory) => (
              <Accessory
                key={acessory.type}
                name={acessory.name}
                icon={getAcessoryIcon(acessory.type)}
              />
            ))}
          </Accessories>
        )}

        <RentalPeriod>
          <CalendarIcon>
            <Feather
              name="calendar"
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>

          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>

          <Feather
            name="chevron-right"
            size={RFValue(10)}
            color={theme.colors.text}
          />

          <DateInfo>
            <DateTitle>ATÈ</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>
        </RentalPeriod>
        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`${formattedCurrencyBRL(car.price)} x ${
              dates.length
            } diárias`}</RentalPriceQuota>
            <ReantalPriceTotal>
              {formattedCurrencyBRL(rentTotal)}
            </ReantalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>

      <Footer>
        <Button
          title="Alugar agora"
          onPress={handleConfirm}
          color={theme.colors.success}
          enabled={!!rentalPeriod}
        />
      </Footer>
    </Container>
  );
}
