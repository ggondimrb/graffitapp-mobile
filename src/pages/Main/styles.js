import styled from 'styled-components/native';
import MapView from 'react-native-maps';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const MapMain = styled(MapView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const ButtonSearch = styled(Button)`
  position: absolute;
  width: 100%;
`;

export const CalloutView = styled.View`
  width: 280px;
  height: 200px;
  align-items: center;
  justify-content: center;
`;

export const CalloutTextTittle = styled.Text`
  font-weight: bold;
  font-size: 16px;
`;

export const CalloutTextDesc = styled.Text`
  color: #666;
  margin-top: 5px;
`;

export const CalloutImage = styled.Image`
  width: 100px;
  height: 100px;
  margin-right: 10px;
  border-radius: 10px;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.1);
`;

export const CalloutListImage = styled.FlatList`
  height: 100px;
  max-width: 210px;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;
