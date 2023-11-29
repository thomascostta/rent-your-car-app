import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation, ParamListBase } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { useNetInfo } from "@react-native-community/netinfo";
import { useTheme } from "styled-components";
import { Feather } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAuth } from "../../hook/auth";
import { api } from "../../services/api";

import {
  Container,
  Content,
  Header,
  HeaderTitle,
  HeaderTop,
  LogoutButton,
  Option,
  Options,
  OptionTitle,
  Photo,
  PhotoButton,
  PhotoContainer,
  Section,
  TitleErros,
} from "./styles";
import { BackButton } from "../../components/BackButton";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { PasswordInput } from "../../components/PasswordInput";
import { TextOfflineInfo } from "../../components/TextOfflineInfo";

type FormDataProfile = {
  name: string;
  driverLicense: string;
};

type FormDataPassword = {
  oldPassword: string;
  newPassword: string;
  RepeatNewPassword: string;
};

export function Profile() {
  const { user, signOut, updatedUser } = useAuth();
  const netInfo = useNetInfo();
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [option, setOption] = useState<"dataEdit" | "passwordEdit">("dataEdit");
  const [avatar, setAvatar] = useState(user.avatar);

  const schemaProfile = yup.object().shape({
    name: yup
      .string()
      .required("Atualize o nome")
      .min(3, "Digite pelo menos três letras do Nome e do Sobrenome")
      .matches(/^([a-zA-Zà-úÀ-Ú]|-|_|\s)+$/, "Apenas letras")
      .test(
        "word-count",
        "Informe ao menos um nome e sobrenome",
        (value: any) => {
          if (value !== undefined) {
            const primaryName =
              value.split(" ").slice(0, 1).join("").length >= 3;
            const secondaryName =
              value.split(" ").slice(1, 2).join("").length >= 3;
            const isValid = primaryName && secondaryName;
            return isValid;
          }
          return true;
        }
      ),
    driverLicense: yup
      .string()
      .required("Atualize a CNH")
      .matches(/^\d{9}$/, "A CNH deve ter exatamente 9 dígitos numéricos"),
  });

  const schemaPassword = yup.object().shape({
    oldPassword: yup.string().required("Informe sua senha atual."),
    newPassword: yup.string().required("Informe a nova senha."),
    RepeatNewPassword: yup
      .string()
      .required("Informe a nova senha.")
      .oneOf([yup.ref("newPassword")], "As senhas precisam ser iguais."),
  });

  const {
    control: controlProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile },
  } = useForm({
    resolver: yupResolver<FormDataProfile>(schemaProfile),
  });

  const {
    control: controlPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
  } = useForm({
    resolver: yupResolver<FormDataPassword>(schemaPassword),
  });

  function handleBack() {
    navigation.goBack();
  }

  function handleOptionChange(optionSelected: "dataEdit" | "passwordEdit") {
    if (netInfo.isConnected === false && optionSelected === "passwordEdit") {
      Alert.alert(
        "Você está offline",
        "Para mudar a senha, conecte-se a Internet"
      );
    } else {
      setOption(optionSelected);
    }
  }

  async function handleAvatarSelect() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  }

  async function handleSignOut() {
    Alert.alert(
      "Tem certeza?",
      "Se você sair, irá precisar de internet para conectar-se novamente.",
      [
        {
          text: "Cancelar",
          onPress: () => {},
        },
        {
          text: "Sair",
          onPress: () => signOut(),
        },
      ]
    );
  }

  async function onSubmitProfile(data: FormDataProfile) {
    const { name, driverLicense } = data;
    try {
      await updatedUser({
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        name,
        driver_license: driverLicense,
        avatar,
        token: user.token,
      });
      Alert.alert("Perfil atualizado");
    } catch (error) {
      Alert.alert("Não foi possível atualizar o perfil");
    }
  }

  async function onSubmitPassword(data: FormDataPassword) {
    const { newPassword, oldPassword } = data;
    if (netInfo.isConnected) {
      api
        .put("users", {
          password: newPassword,
          old_password: oldPassword,
        })
        .then(() => {
          Alert.alert("Senhas atualizadas");
        })
        .catch(() => {
          Alert.alert(
            "Ops!",
            "Não foi possível atualizar a senha, tente mais tarde."
          );
        });
    }
  }

  const handleSubmitType =
    option === "dataEdit"
      ? handleSubmitProfile(onSubmitProfile)
      : handleSubmitPassword(onSubmitPassword);

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="transparent"
          />
          <Header>
            <HeaderTop>
              <BackButton color={theme.colors.shape} onPress={handleBack} />
              <HeaderTitle>Editar Perfil</HeaderTitle>
              <LogoutButton onPress={handleSignOut}>
                <Feather name="power" size={24} color={theme.colors.shape} />
              </LogoutButton>
            </HeaderTop>

            <PhotoContainer>
              {!!avatar && <Photo source={{ uri: avatar }} />}
              <PhotoButton onPress={handleAvatarSelect}>
                <Feather name="camera" size={24} color={theme.colors.shape} />
              </PhotoButton>
            </PhotoContainer>
          </Header>
          <Content>
            <Options>
              <Option
                active={option === "dataEdit"}
                onPress={() => handleOptionChange("dataEdit")}
              >
                <OptionTitle active={option === "dataEdit"}>Dados</OptionTitle>
              </Option>
              <Option
                active={option === "passwordEdit"}
                onPress={() => handleOptionChange("passwordEdit")}
              >
                <OptionTitle active={option === "passwordEdit"}>
                  Trocar senha
                </OptionTitle>
              </Option>
            </Options>
            {option === "dataEdit" ? (
              <Section>
                <Controller
                  control={controlProfile}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      iconName="user"
                      autoCorrect={false}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      defaultValue={user.name}
                    />
                  )}
                  name="name"
                  rules={{ required: true }}
                />
                {errorsProfile.name && (
                  <TitleErros>{errorsProfile.name.message}</TitleErros>
                )}
                <Input
                  iconName="mail"
                  editable={false}
                  defaultValue={user.email}
                />
                <Controller
                  control={controlProfile}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      iconName="credit-card"
                      autoCorrect={false}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="numeric"
                      value={value}
                      defaultValue={user.driver_license}
                    />
                  )}
                  name="driverLicense"
                  rules={{ required: true }}
                />
                {errorsProfile.driverLicense && (
                  <TitleErros>{errorsProfile.driverLicense.message}</TitleErros>
                )}
              </Section>
            ) : netInfo.isConnected === true ? (
              <Section>
                <Controller
                  control={controlPassword}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <PasswordInput
                      iconName="lock"
                      placeholder="Senha atual"
                      autoCorrect={false}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      keyboardType="numeric"
                    />
                  )}
                  name="oldPassword"
                  rules={{ required: true }}
                />
                {errorsPassword.oldPassword && (
                  <TitleErros>{errorsPassword.oldPassword.message}</TitleErros>
                )}
                <Controller
                  control={controlPassword}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <PasswordInput
                      iconName="lock"
                      placeholder="Nova senha"
                      autoCorrect={false}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      keyboardType="numeric"
                    />
                  )}
                  name="newPassword"
                  rules={{ required: true }}
                />

                <Controller
                  control={controlPassword}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <PasswordInput
                      iconName="lock"
                      placeholder="Repetir nova senha"
                      autoCorrect={false}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      keyboardType="numeric"
                    />
                  )}
                  name="RepeatNewPassword"
                  rules={{ required: true }}
                />
                {errorsPassword.RepeatNewPassword && (
                  <TitleErros>
                    {errorsPassword.RepeatNewPassword.message}
                  </TitleErros>
                )}
              </Section>
            ) : (
              <Section>
                <TextOfflineInfo text="Sem conexão com a internet." />
              </Section>
            )}

            <Button title="Salvar alterações" onPress={handleSubmitType} />
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
