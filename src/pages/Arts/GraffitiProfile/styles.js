import styled from 'styled-components/native';

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
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
`;

export const GraffitiDescription = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #c6c6c6;
  margin-bottom: 10px;
  margin-left: 10px;
`;
