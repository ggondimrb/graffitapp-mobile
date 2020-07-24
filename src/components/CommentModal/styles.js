import styled from 'styled-components/native';

export const Comments = styled.FlatList.attrs({
  showsVerticalScrollIndicator: true,
})`
  flex: 1;
  padding: 5px 20px;
  height: 100%;
  background-color: #353544;
`;

export const Comment = styled.View`
  margin: 5px 0;
`;

export const CommentDetail = styled.View`
  flex-direction: row;
`;

export const CommentName = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #c6c6c6;
  margin-right: 5px;
`;

export const CommentDesc = styled.Text`
  font-size: 12px;
  color: #c6c6c6;
`;

export const CommentHour = styled.Text`
  font-size: 12px;
  color: #c6c6c6;
`;
