import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  StatusBar,
} from "react-native";
import {
  ParamListBase,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "styled-components";

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
import { Button } from "../../../components/Button";
import { PasswordInput } from "../../../components/PasswordInput";
import { api } from "../../../services/api";

type FormData = {
  password: string;
  verifyPassword: string;
};

interface Params {
  user: {
    name: string;
    email: string;
    driverLicense: string;
  };
}

const schema = yup.object().shape({
  password: yup.string().required("Informe sua senha atual."),
  verifyPassword: yup
    .string()
    .required("Confirme sua senha.")
    .oneOf([yup.ref("password")], "As senhas precisam ser iguais."),
});

export function SignUpSecondStep() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute();
  const theme = useTheme();

  const { user } = route.params as Params;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: FormData) {
    api
      .post("/users", {
        name: user.name,
        email: user.email,
        driver_license: user.driverLicense,
        password: data.password,
      })
      .then(() => {
        navigation.navigate("Confirmation", {
          nextScreenRoute: "SignIn",
          title: "Conta criada",
          message: `Agora é só fazer login \n e aproveitar.`,
        });
      })
      .catch(() => Alert.alert("Opa", "Não foi possível cadastrar!"));
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
            <FormTitle>2. Senha</FormTitle>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  iconName="lock"
                  placeholder="Senha"
                  autoCorrect={false}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  keyboardType="numeric"
                />
              )}
              name="password"
              rules={{ required: true }}
            />

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  iconName="lock"
                  placeholder="Repetir senha"
                  autoCorrect={false}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  keyboardType="numeric"
                />
              )}
              name="verifyPassword"
              rules={{ required: true }}
            />
            {errors.verifyPassword && (
              <TitleErros>{errors.verifyPassword.message}</TitleErros>
            )}
          </Form>

          <Button
            title="Cadastrar"
            onPress={handleSubmit(onSubmit)}
            color={theme.colors.success}
          />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
