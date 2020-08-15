import styled from 'styled-components/native';

export const Comments = styled.ScrollView`
  flex: 1;
  padding: 10px 10px;
  height: 80%;
  background-color: #353544;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

export const Comment = styled.View`
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
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

export const RemoveComment = styled.TouchableOpacity`
  position: absolute;
  right: 10px;
  width: 25px;
  height: 25px;
`;
