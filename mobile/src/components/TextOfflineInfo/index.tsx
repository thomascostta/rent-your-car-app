import { Text } from './styles';

interface Props {
  text: string;
}
export function TextOfflineInfo({ text }: Props) {
  return <Text>{text}</Text>;
}
