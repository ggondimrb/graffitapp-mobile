import styled from 'styled-components/native';
import {RectButton} from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
`;

export const GraffitiList = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
  padding: 0 10px;
`;

export const GraffitiView = styled.View`
  flex-direction: column;
  padding: 10px 0;
`;

export const Graffiti = styled.TouchableOpacity`
  padding-bottom: 5px;
  padding-left: 15px;
`;

export const Image = styled.Image`
  height: 300px;
  width: 100%;
  border-radius: 15px;
`;

export const Title = styled.Text`
  color: #fff;
  font-weight: bold;
`;

export const Description = styled.Text`
  color: #737380;
`;

export const Artist = styled.Text`
  color: #737380;
`;

export const Localization = styled.Text`
  color: #737380;
`;

export const AddButton = styled(RectButton)`
  position: absolute;
  height: 60px;
  width: 60px;
  background: #3b9eff;
  border-radius: 30px;
  bottom: 10px;
  right: 10px;

  align-items: center;
  justify-content: flex-end;
`;

export const Separator = styled.View`
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 10px 0;
`;
