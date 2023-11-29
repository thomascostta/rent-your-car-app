import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  StatusBar,
} from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "styled-components";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAuth } from "../../hook/auth";

import {
  Container,
  Header,
  Form,
  SubTitle,
  Title,
  Footer,
  TitleErros,
} from "./styles";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { PasswordInput } from "../../components/PasswordInput";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve conter pelo menos 6 caracteres")
    .required("A senha é obrigatória"),
});

type FormData = {
  email: string;
  password: string;
};

export function SignIn() {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const { signIn } = useAuth();
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      await schema.validate(data);

      signIn({ email: data.email, password: data.password });
    } catch {
      Alert.alert(
        "Erro na autenticação",
        "Ocorreu um erro ao fazer login, por favor tente mais tarde"
      );
    }
  }

  function handleNewAccount() {
    navigate("SignUpFirstStep");
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container style={{ marginTop: top }}>
          <StatusBar
            barStyle="dark-content"
            translucent
            backgroundColor="transparent"
          />
          <Header>
            <Title>Estamos{`\n`}quase lá.</Title>
            <SubTitle>
              Faça seu login para começar{`\n`}uma experiência incrível.
            </SubTitle>
          </Header>

          <Form>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  iconName="mail"
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCorrect={false}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
              name="email"
              rules={{ required: true }}
            />
            {errors.email && <TitleErros>{errors.email.message}</TitleErros>}

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  iconName="lock"
                  placeholder="Senha"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
              name="password"
              rules={{ required: true }}
            />
            {errors.password && (
              <TitleErros>{errors.password.message}</TitleErros>
            )}
          </Form>

          <Footer>
            <Button title="Login" onPress={handleSubmit(onSubmit)} />
            <Button
              title="Criar conta gratuita"
              onPress={handleNewAccount}
              light
              color={theme.colors.background_secondary}
            />
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
