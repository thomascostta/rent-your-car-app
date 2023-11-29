import { useRef, useState } from 'react';
import { FlatList, ViewToken } from 'react-native';
import { Bullet } from '../Bullet';
import { CarImage, CarImageWrapper, Container, ImageIndexes } from './styles';
import { LoadAnimation } from '../LoadAnimation';

interface Props {
  imagesUrl: {
    id: string;
    photo: string;
  }[];
}

interface ChangeImageProps {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

export function ImageSlider({ imagesUrl }: Props) {
  const [imageIndex, setImageIndex] = useState(0);

  const indexChanged = useRef((info: ChangeImageProps) => {
    const index = info.viewableItems[0].index!;
    setImageIndex(index);
  });

  return (
    <Container>
      {imagesUrl ? (
        <>
          <ImageIndexes>
            {imagesUrl.map((item, index) => (
              <Bullet key={item.id} active={index === imageIndex} />
            ))}
          </ImageIndexes>
          <FlatList
            data={imagesUrl}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CarImageWrapper>
                <CarImage
                  source={{
                    uri: item.photo,
                  }}
                  resizeMode="contain"
                />
              </CarImageWrapper>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={indexChanged.current}
          />
        </>
      ) : (
        <LoadAnimation />
      )}
    </Container>
  );
}
