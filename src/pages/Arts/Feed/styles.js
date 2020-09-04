import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.View`
  flex: 1;
`;

export const GraffitiList = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
  padding-top: 15px;
`;

export const Graffiti = styled.TouchableOpacity`
  flex-direction: column;
  padding: 10px 0;
`;

export const GraffitiView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
`;

export const Image = styled.Image`
  height: ${(props) => props.height}px;
  width: 100%;
`;

export const Title = styled.Text`
  color: #fff;
  font-weight: bold;
  padding-left: 5px;
  margin: 5px;
`;

export const Description = styled.Text`
  color: #737380;
  margin-left: 10px;
`;

export const AddButton = styled(Button)`
  position: absolute;
  height: 60px;
  width: 60px;
  background: #3b9eff;
  border-radius: 30px;
  bottom: 10px;
  right: 10px;
  align-items: center;
  justify-content: center;
`;

export const Separator = styled.View`
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 10px 0;
`;
