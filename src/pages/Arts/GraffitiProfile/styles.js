import styled from 'styled-components/native';
import Input from '~/components/Input';

export const Container = styled.ScrollView`
  flex: 1;
`;

export const GraffitiImage = styled.Image`
  width: 100%;
  height: 300px;
`;

export const GraffitiView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-bottom: 5px;
  padding-left: 15px;
  padding-right: 15px;
`;

export const GraffitiTitle = styled.Text`
  flex: 1;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
`;

export const GraffitiSub = styled.View`
  top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  display: flex;
`;

export const GraffitiDescription = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #c6c6c6;
  margin-bottom: 5px;
  margin-left: 10px;
  margin-right: 10px;
`;

export const GraffitiActions = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: 5px 20px;
`;

export const InputComment = styled(Input)`
  background-color: #353544;
  height: 70px;
`;
