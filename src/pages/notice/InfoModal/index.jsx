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
    const selfID = parseInt(sessionStorage.getItem('userID'), 10);
    return (
      <Modal
        visible={currentView}
        centered
        title={[
          <span>通知详情</span>,
          <span>
            {currentNotice.is_top > 0 ? (
              <span className={styles.tip} style={{ color: 'red', margin: 'auto 16px' }}>
                <Icon type="caret-up" />
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
            <Authorized authority={['root']} noMatch={null}>
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
                    payload: {
                      search: false,
                    },
                  });
                }}
              >
                <Button type="danger" loading={deleteLoading}>
                  删除
                </Button>
              </Popconfirm>
            </Authorized>
            <Authorized authority={['admin']} noMatch={null}>
              {currentNotice.user_id === selfID ? (
                <React.Fragment>
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
                        payload: {
                          search: false,
                        },
                      });
                    }}
                  >
                    <Button type="danger" loading={deleteLoading}>
                      删除
                    </Button>
                  </Popconfirm>
                </React.Fragment>
              ) : null}
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
        <p style={{ fontWeight: '600', fontSize: '20px' }}>{currentNotice.title}</p>
        <div>{currentNotice.content}</div>
      </Modal>
    );
  }
}

export default InfoModal;
