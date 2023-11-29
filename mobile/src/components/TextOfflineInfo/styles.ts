import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Text = styled.Text`
  font-size: ${RFValue(15)}px;
  font-family: ${({ theme }) => theme.fonts.primary_400};
  color: ${({ theme }) => theme.colors.main};
  text-align: center;
`;
