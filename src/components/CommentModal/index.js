import React from 'react';
import {useSelector} from 'react-redux';

import {Feather} from '@expo/vector-icons';

import api from '~/services/api';

import {
  Comments,
  Comment,
  CommentDetail,
  CommentName,
  CommentDesc,
  CommentHour,
  RemoveComment,
} from './styles';

export default function CommentModal({comments, getComments, userId}) {
  const {id} = useSelector((state) => state.auth.user);

  async function removeComment(id) {
    await api.delete(`comment/${id}`);
    getComments();
  }
  return (
    <Comments>
      {comments.map((com) => {
        return (
          <Comment key={com.id}>
            <CommentDetail>
              <CommentName>{com.user.name}</CommentName>
              <CommentDesc>{com.comment}</CommentDesc>
              {(userId === id || com.user.id === id) && (
                <RemoveComment>
                  <Feather
                    name="x"
                    size={25}
                    color="#f5222d"
                    onPress={() => removeComment(com.id)}
                  />
                </RemoveComment>
              )}
            </CommentDetail>
            <CommentHour>{com.dateFormated}</CommentHour>
          </Comment>
        );
      })}
    </Comments>
  );
}
