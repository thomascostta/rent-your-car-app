import SpeedSVG from '../assets/speed.svg';
import AccelerationSVG from '../assets/acceleration.svg';
import ForceSVG from '../assets/force.svg';
import GasolineSVG from '../assets/gasoline.svg';
import ExchangeSVG from '../assets/exchange.svg';
import PeopleSVG from '../assets/people.svg';
import EnergySVG from '../assets/energy.svg';
import HybridSVG from '../assets/hybrid.svg';
import CarSVG from '../assets/car.svg';

export function getAcessoryIcon(type: string) {
  switch (type) {
    case 'speed':
      return SpeedSVG;
    case 'acceleration':
      return AccelerationSVG;
    case 'turning_diameter':
      return ForceSVG;
    case 'gasoline_motor':
      return GasolineSVG;
    case 'exchange':
      return ExchangeSVG;
    case 'seats':
      return PeopleSVG;
    case 'electric_motor':
      return EnergySVG;
    case 'hybrid_motor':
      return HybridSVG;
    default:
      return CarSVG;
  }
}
