import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, StatusBar } from "react-native";
import { synchronize } from "@nozbe/watermelondb/sync";
import {
  useNavigation,
  ParamListBase,
  useFocusEffect,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RFValue } from "react-native-responsive-fontsize";
import { useNetInfo } from "@react-native-community/netinfo";

import { database } from "../../database";
import { Car as ModelCar } from "../../database/model/Car";
import { api } from "../../services/api";

import { Container, Header, TotalCars, HeaderContent } from "./styles";
import { Car } from "../../components/Car";
import { ButtonFloating } from "../../components/ButtonFloating";
import Logo from "../../assets/logo.svg";
import { LoadAnimation } from "../../components/LoadAnimation";

export function Home() {
  const [cars, setCars] = useState<ModelCar[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const synchronizing = useRef(false);
  const netInfo = useNetInfo();

  function handleCarDetails(car: ModelCar) {
    navigation.navigate("CarDetails", { carId: car.id });
  }

  async function offlineSynchronize() {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        const response = await api.get(
          `cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`
        );

        const { changes, latestVersion } = response.data;
        return { changes, timestamp: latestVersion };
      },
      pushChanges: async ({ changes }) => {
        const user = changes.users;
        if (user) {
          await api.post("/users/sync", user);
        }
      },
    });
    await fetchCars();
  }

  async function fetchCars() {
    try {
      const carCollection = database.get<ModelCar>("cars");
      const cars = await carCollection.query().fetch();
      setCars(cars);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchCars();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const syncChanges = async () => {
        if (netInfo.isConnected && !synchronizing.current) {
          synchronizing.current = true;

          try {
            await offlineSynchronize();
          } catch (err) {
            console.log(err);
          } finally {
            synchronizing.current = false;
          }
        }
      };

      syncChanges();
    }, [netInfo.isConnected])
  );

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />
          <TotalCars>Total de {cars.length} carros</TotalCars>
        </HeaderContent>
      </Header>

      {loading ? (
        <LoadAnimation />
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Car data={item} onPress={() => handleCarDetails(item)} />
          )}
          contentContainerStyle={{ padding: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
      <ButtonFloating positionButton={{ bottom: 20, right: 22 }} />
    </Container>
  );
}
