import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const ReviewArt = styled.ScrollView`
  padding: 10px;
  margin: 24px;
  background-color: #fff;
  border-radius: 10px;
  margin-top: 60px;
`;

export const TextReviewArtTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #41414d;
  margin-bottom: 10px;
`;
export const TextReviewArtLabel = styled.Text`
  font-weight: bold;
`;
export const TextReviewArt = styled.Text`
  padding-bottom: 10px;
`;

export const ListImage = styled.FlatList`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const Image = styled.Image`
  width: 200px;
  height: 200px;
  margin-right: 10px;
  border-radius: 25px;
`;

export const SubmitButton = styled(Button)`
  margin-bottom: 20px;
`;
