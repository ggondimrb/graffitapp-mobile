import styled from 'styled-components/native';
import Button from '~/components/Button';

import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const widthImage = windowWidth / 3;

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const EditButton = styled(Button)`
  margin-top: 5px;
`;

export const ArtList = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  numColumns: 3,
})`
  padding: 10px 0;
`;

export const GraffitiContainer = styled.TouchableOpacity``;

export const GraffitiImage = styled.Image`
  width: ${widthImage}px;
  height: ${widthImage}px;
  border-radius: 5px;
`;

export const Username = styled.Text`
  color: #fff;
  font-size: 18px;
  margin-bottom: 10px;
  margin-left: 5px;
`;
