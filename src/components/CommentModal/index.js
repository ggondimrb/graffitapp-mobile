import React from 'react';

import {
  Comments,
  Comment,
  CommentDetail,
  CommentName,
  CommentDesc,
  CommentHour,
} from './styles';

export default function CommentModal({comments}) {
  return (
    <Comments
      contentContainerStyle={{flexGrow: 1}}
      data={comments}
      keyExtractor={(item) => String(item.id)}
      renderItem={({item}) => (
        <Comment>
          <CommentDetail>
            <CommentName>{item.user.name}</CommentName>
            <CommentDesc>{item.comment}</CommentDesc>
          </CommentDetail>
          <CommentHour>{item.dateFormated}</CommentHour>
        </Comment>
      )}
    />
  );
}
