import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Container,
  Form,
  FormTitle,
  Header,
  Steps,
  Subtitle,
  Title,
  TitleErros,
} from "./styles";
import { BackButton } from "../../../components/BackButton";
import { Bullet } from "../../../components/Bullet";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Digite pelo menos três letras do Nome e do Sobrenome")
    .required("Insira seu nome")
    .matches(/^([a-zA-Zà-úÀ-Ú]|-|_|\s)+$/, "Apenas letras")
    .test(
      "word-count",
      "Informe ao menos um nome e sobrenome",
      (value: any) => {
        if (value !== undefined) {
          const primaryName = value.split(" ").slice(0, 1).join("").length >= 3;
          const secondaryName =
            value.split(" ").slice(1, 2).join("").length >= 3;
          const isValid = primaryName && secondaryName;
          return isValid;
        }
        return true;
      }
    ),
  email: yup
    .string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  driverLicense: yup
    .string()
    .matches(/^\d+$/, "Informe apenas números para o número da CNH")
    .min(9, "Informe o número da CNH de 9 dígitos")
    .required("A CNH é obrigatória"),
});

type FormData = {
  name: string;
  email: string;
  driverLicense: string;
};

export function SignUpFirstStep() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: FormData) {
    navigation.navigate("SignUpSecondStep", { user: data });
  }

  function handleBack() {
    navigation.goBack();
  }
  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar
            barStyle="dark-content"
            translucent
            backgroundColor="transparent"
          />
          <Header>
            <BackButton onPress={handleBack} />
            <Steps>
              <Bullet />
              <Bullet active />
            </Steps>
          </Header>
          <Title>Crie sua{"\n"}conta</Title>
          <Subtitle>
            Faça seu cadastro de{"\n"}
            forma rápida e fácil
          </Subtitle>

          <Form>
            <FormTitle>1. Dados</FormTitle>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  iconName="user"
                  placeholder="Nome"
                  autoCorrect={false}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
              name="name"
              rules={{ required: true }}
            />
            {errors.name && <TitleErros>{errors.name.message}</TitleErros>}

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  iconName="mail"
                  placeholder="E-mail"
                  autoCorrect={false}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  keyboardType="email-address"
                />
              )}
              name="email"
              rules={{ required: true }}
            />
            {errors.email && <TitleErros>{errors.email.message}</TitleErros>}

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  iconName="credit-card"
                  placeholder="CNH"
                  autoCorrect={false}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  keyboardType="numeric"
                />
              )}
              name="driverLicense"
              rules={{ required: true }}
            />
            {errors.driverLicense && (
              <TitleErros>{errors.driverLicense.message}</TitleErros>
            )}
          </Form>

          <Button title="Próximo" onPress={handleSubmit(onSubmit)} />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
