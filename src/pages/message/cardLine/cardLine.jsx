import React from 'react';
import { connect } from 'dva';
import { Card, Carousel, Icon, Popconfirm, Popover } from 'antd';
import router from 'umi/router';
import { formatImgUrl, showNotification } from '../../../utils/common';

import styles from './cardLine.less';

const CardLine = props => (
  <div className={styles.cardLine}>
    {props[`${props.side}Msg`].map((m, i) => (
      <Card
        hoverable
        className={styles.card}
        cover={
          <Carousel dotPosition="top">
            {m.img_url.map((imgInfo, index) => (
              <img alt={index} src={formatImgUrl(imgInfo.name)} />
            ))}
          </Carousel>
        }
        actions={[
          <div
            onClick={() => {
              props.dispatch({
                type: 'message/getMessageDetail',
                payload: {
                  message: m,
                },
              });
            }}
          >
            <Popover trigger="click" content={<span>{props.detail.thumbList}</span>}>
              <Icon type="like" theme="twoTone" twoToneColor="#ff00ff" />
              <span> {m.thumb}</span>
            </Popover>
          </div>,
          <div
            onClick={() => {
              if (m.comment !== 0) {
                router.push(`/message/comment/${m.id}`);
              } else {
                showNotification('warn', '该条推荐消息暂时没有评论！');
              }
            }}
          >
            <Icon type="message" theme="twoTone" twoToneColor="#836fff" />
            <span> {m.comment}</span>
          </div>,
          <Icon
            type="edit"
            key="edit"
            theme="twoTone"
            twoToneColor="#3a5fcd"
            onClick={() => {
              props.dispatch({
                type: 'message/updateMessagePrepare',
                payload: {
                  message: m,
                  index: i,
                  side: props.side,
                },
              });
              props.openEditModal();
            }}
          />,
          <Popconfirm
            title="确定删除此条推荐吗？"
            onConfirm={() => {
              props.dispatch({
                type: 'message/handleDelete',
                payload: {
                  side: props.side,
                  index: i,
                  message: m,
                },
              });
            }}
          >
            <Icon type="delete" key="delete" theme="twoTone" twoToneColor="#f00" />
          </Popconfirm>,
        ]}
      >
        <div className={styles.meta}>{m.content}</div>
      </Card>
    ))}
  </div>
);

export default connect(state => state.message)(CardLine);
