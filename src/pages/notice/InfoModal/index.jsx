import {
  Button,
  Icon,
  Modal,
  Popconfirm,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Authorized from '../../../utils/Authorized';

import styles from './style.less';

@connect(({ notice }) => ({
  notice,
}))
class InfoModal extends Component {
  render() {
    const { notice, dispatch } = this.props;
    const {
      currentView,
      currentLoading,
      currentNotice,
      deleteLoading,
    } = notice;
    return (
      <Modal
        zIndex={9900}
        visible={currentView}
        centered
        title={[
          <span>通知详情</span>,
          <span>
            {currentNotice.is_top > 0 ? (
              <span className={styles.tip} style={{ color: 'red', margin: 'auto 8px' }}>
                <Icon type="fire" />
                置顶通知
              </span>
            ) : (
              ''
            )}
          </span>,
        ]}
        loading={currentLoading}
        footer={[
          <div loading>
            <span className={styles.tip} style={{ margin: 'auto 10px' }}>
              {`${currentNotice.user} 发布于 
                ${currentNotice.create_at}
              `}
            </span>
            <Authorized authority={['admin', 'root']} noMatch={<div></div>}>
              <Button
                onClick={() => {
                  dispatch({
                    type: 'notice/save',
                    payload: {
                      editView: true,
                      editTitle: currentNotice.title,
                      editContent: currentNotice.content,
                      editIsTop: currentNotice.is_top,
                      currentView: false,
                    },
                  });
                }}
              >
                修改
              </Button>
              <Popconfirm
                zIndex={9950}
                title="确定要删除这条通知吗？"
                onConfirm={() => {
                  dispatch({
                    type: 'notice/handleDelete',
                  });
                }}
              >
                <Button type="danger" loading={deleteLoading}>
                  删除
                </Button>
              </Popconfirm>
            </Authorized>
          </div>,
        ]}
        width={800}
        onCancel={() => {
          dispatch({
            type: 'notice/save',
            payload: {
              currentView: false,
            },
          });
        }}
      >
        <p style={{ fontWeight: '500', fontSize: '24px' }}>{currentNotice.title}</p>
        <div>{currentNotice.content}</div>
      </Modal>
    );
  }
}

export default InfoModal;
