import { useState, useEffect } from "react";
import {
  ParamListBase,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNetInfo } from "@react-native-community/netinfo";

import {
  Container,
  Header,
  ContentButton,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  About,
  Accessories,
  Footer,
} from "./styles";

import { Accessory } from "../../components/Accessory";
import { BackButton } from "../../components/BackButton";
import { ImageSlider } from "../../components/ImageSlider";
import { Button } from "../../components/Button";
import { TextOfflineInfo } from "../../components/TextOfflineInfo";

import { api } from "../../services/api";
import { CarDTO } from "../../dtos/carDTO";
import { getAcessoryIcon } from "../../utils/getAcessoryIcon";
import { formattedCurrencyBRL } from "../../utils/currencyBRL";
import { StatusBar } from "react-native";

interface Params {
  carId: string;
}

export function CarDetails() {
  const [car, setCar] = useState<CarDTO>({} as CarDTO);

  const netInfo = useNetInfo();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute();
  const { carId } = route.params as Params;

  function handleConfirmRental() {
    navigation.navigate("Scheduling", { car });
  }

  function handleBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function fetchCarUpdated() {
      const response = await api.get(`cars/${carId}`);
      setCar(response.data);
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
        <ContentButton>
          <BackButton onPress={handleBack} />
        </ContentButton>

        <CarImages>
          <ImageSlider imagesUrl={car.photos} />
        </CarImages>
      </Header>

      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.period}</Period>
            <Price>
              {netInfo.isConnected === true
                ? formattedCurrencyBRL(car.price)
                : "..."}
            </Price>
          </Rent>
        </Details>

        {car.accessories && (
          <Accessories>
            {car.accessories.map((acessory) => (
              <Accessory
                key={acessory.type}
                name={acessory.name}
                icon={getAcessoryIcon(acessory.type)}
              />
            ))}
          </Accessories>
        )}

        <About>{car.about}</About>
      </Content>

      <Footer>
        <Button
          title="Escolher periodo do aluguel"
          onPress={handleConfirmRental}
          enabled={netInfo.isConnected === true}
        />
        {netInfo.isConnected === false && (
          <TextOfflineInfo
            text=" Conecte-se a Internet para ver mais detalhes e para agendar seu
          carro"
          />
        )}
      </Footer>
    </Container>
  );
}
