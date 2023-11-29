import { Container } from './styles';

interface Props {
  active?: boolean;
}

export function Bullet({ active = false }: Props) {
  return <Container testID="Bullet" active={active} />;
}
