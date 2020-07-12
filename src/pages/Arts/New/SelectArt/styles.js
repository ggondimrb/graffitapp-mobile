import styled from 'styled-components/native';
import Input from '~/components/Input';
import Button from '~/components/Button';
import MapView from 'react-native-maps';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const Separator = styled.View`
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 20px 0 30px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  align-self: center;
  margin: 15px 0;
`;

export const Form = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {padding: 30},
})`
  align-self: stretch;
  margin-top: 60px;
`;

export const FormInput = styled(Input)`
  margin-bottom: 10px;
`;

export const SubmitButton = styled(Button)`
  margin-top: 5px;
`;

export const ListImage = styled.FlatList`
  flex: 1;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const AddImage = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  background-color: #131313;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
`;

export const TitleAddImage = styled.Text`
  color: #fff;
`;

export const Image = styled.Image`
  width: 100px;
  height: 100px;
  margin-right: 10px;
  border-radius: 25px;
`;

export const RemoveImage = styled.TouchableOpacity`
  position: absolute;
  right: 10px;
  width: 25px;
  height: 25px;
`;

export const TitleMapArtSelect = styled.Text`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  align-self: center;
  margin-bottom: 10px;
`;

export const MapArtSelect = styled(MapView)`
  width: 100%;
  height: 300px;
  margin-bottom: 50px;
`;
