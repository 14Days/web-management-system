import React from 'react';
import { connect } from 'dva';
import { Card, Carousel, Icon } from 'antd';
import { formatImgUrl } from '../../../utils/common';

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
          <div>
            <Icon type="like" theme="twoTone" twoToneColor="#ff00ff" />
            <span> {m.thumb}</span>
          </div>,
          <div>
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
          <Icon
            type="delete"
            key="delete"
            theme="twoTone"
            twoToneColor="#f00"
            onClick={() => {
              props.dispatch({
                type: 'message/handleDelete',
                payload: {
                  side: props.side,
                  index: i,
                  message: m,
                },
              });
            }}
          />,
        ]}
      >
        <div className={styles.meta}>{m.content}</div>
      </Card>
    ))}
  </div>
);

export default connect(state => state.message)(CardLine);
