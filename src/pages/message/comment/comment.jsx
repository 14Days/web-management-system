import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Avatar, Comment } from 'antd';
import { formatAppAvaUrl } from '../../../utils/common';

class CommentPage extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'comment/handleInit',
    });
  }

  render() {
    return (
      <PageHeaderWrapper>
        {this.props.comment.map(first => {
          const {
            user: { nickname, avatar },
            content,
            second,
          } = first;
          return (
            <Comment
              actions={[<span key="comment-nested-reply-to">delete</span>]}
              author={<a>{nickname}</a>}
              avatar={<Avatar src={formatAppAvaUrl(avatar)} alt={nickname} />}
              content={<p>{content}</p>}
            >
              {second.map(c => {
                const {
                  user: { nicknameNest, avatarNest },
                  contentNest,
                } = c;
                return (
                  <Comment
                    actions={[<span key="comment-nested-reply-to">delete</span>]}
                    author={<a>{nicknameNest}</a>}
                    avatar={<Avatar src={formatAppAvaUrl(avatarNest)} alt={nicknameNest} />}
                    content={<p>{contentNest}</p>}
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
