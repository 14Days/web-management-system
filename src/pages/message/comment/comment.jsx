import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Avatar, Comment } from 'antd';
import { formatAppAvaUrl } from '../../../utils/common';

import styles from './comment.less';

class CommentPage extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'comment/handleInit',
    });
  }

  handleDelete = (level, commentID) => {
    this.props.dispatch({
      type: 'comment/handleDeleteComment',
      payload: {
        level,
        commentID,
      },
    });
  };

  render() {
    return (
      <PageHeaderWrapper>
        {this.props.comment.map(first => {
          const {
            user: { nickname, avatar },
            content,
            second,
            create_at: create,
            id,
          } = first;
          return (
            <Comment
              className={styles.comment}
              actions={[
                <span
                  className={styles.delete}
                  onClick={() => {
                    this.handleDelete(1, id);
                  }}
                >
                  删除此条评论
                </span>,
              ]}
              author={<a>{nickname}</a>}
              avatar={<Avatar src={formatAppAvaUrl(avatar)} alt={nickname} />}
              content={
                <div>
                  <p className={styles.content}>{content}</p>
                  <p className={styles.createTime}>发布于 {create}</p>
                </div>
              }
            >
              {second.map(c => {
                const {
                  user: { nickname: nicknameNest, avatar: avatarNest },
                  content: contentNest,
                  create_at: createNest,
                  id: idNest,
                } = c;
                return (
                  <Comment
                    className={styles.comment}
                    actions={[
                      <span
                        className={styles.delete}
                        onClick={() => {
                          this.handleDelete(2, idNest);
                        }}
                      >
                        删除此条评论
                      </span>,
                    ]}
                    author={<a>{nicknameNest}</a>}
                    avatar={<Avatar src={formatAppAvaUrl(avatarNest)} alt={nicknameNest} />}
                    content={
                      <div>
                        <p className={styles.content}>{contentNest}</p>
                        <p className={styles.createTime}>发布于 {createNest}</p>
                      </div>
                    }
                  />
                );
              })}
            </Comment>
          );
        })}
      </PageHeaderWrapper>
    );
  }
}

export default connect(state => state.comment)(CommentPage);
