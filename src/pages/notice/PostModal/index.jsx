import {
  Button,
  Icon,
  Input,
  Modal,
  Radio,
  Tooltip,
  Switch,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Authorized from '../../../utils/Authorized';
import styles from './style.less';

@connect(({ notice }) => ({
  notice,
}))
class PostModal extends Component {
  render() {
    const { TextArea } = Input;
    const { notice, dispatch } = this.props;
    const { postView, postLoading, postType, title, content, isTop } = notice;

    // 发布通知对话框中的提示内容
    let tipsWord = (
      <span className={styles.tip} style={{ color: 'red' }}>
        <Icon type="exclamation-circle" style={{ margin: '0 5px' }} />
        请先选择发送的通知类型
      </span>
    );
    switch (postType) {
      case 1:
        tipsWord = (
          <span className={styles.tip}>把通知发送给Web后台，所有设计师和管理员将看到这则通知</span>
        );
        break;
      case 2:
        tipsWord = (
          <span className={styles.tip}>把通知发送给设计师，您旗下的设计师将看到这则通知</span>
        );
        break;
      case 3:
        tipsWord = (
          <span className={styles.tip}>把通知发送给App应用，只有App应用的用户才能看到这则通知</span>
        );
        break;
      default:
        break;
    }

    return (
      <Modal
        visible={postView}
        centered
        maskClosable={false}
        closable={!postLoading}
        title="发布通知"
        footer={
          <Button
            loading={postLoading}
            disabled={postType === 0 || title === ''}
            onClick={() => {
              dispatch({
                type: 'notice/send',
              });
            }}
          >
            发布
          </Button>
        }
        width={800}
        onCancel={() => {
          dispatch({
            type: 'notice/exitPost',
          });
        }}
      >
        {/* 以上：自定义框底组件（发布按钮），退出时清空相关变量， 发送时不允许关闭对话框 */}
        {/* 发布类型选择 */}
        <Radio.Group value={postType} className={styles.typeSelect}>
          {/* 管理员通知需要权限判定 */}
          <Authorized
            authority={['root']}
            noMatch={
              <Tooltip title="没有权限😜">
                <Radio.Button disabled>管理员通知</Radio.Button>
              </Tooltip>
            }
          >
            <Radio.Button
              value={1}
              onClick={() => {
                dispatch({
                  type: 'notice/save',
                  payload: {
                    postType: 1,
                  },
                });
              }}
            >
              管理员通知
            </Radio.Button>
          </Authorized>
          <Radio.Button
            value={2}
            onClick={() => {
              dispatch({
                type: 'notice/save',
                payload: {
                  postType: 2,
                },
              });
            }}
          >
            设计师通知
          </Radio.Button>
          <Radio.Button
            value={3}
            onClick={() => {
              dispatch({
                type: 'notice/save',
                payload: {
                  postType: 3,
                },
              });
            }}
          >
            用户通知
          </Radio.Button>
        </Radio.Group>
        {/* 下面的是提示词 */}
        {tipsWord}
        <br />
        <Input
          placeholder="标题"
          disabled={postType === 0}
          value={title}
          onChange={e => {
            dispatch({
              type: 'notice/save',
              payload: {
                title: e.target.value,
              },
            });
          }}
          style={{ marginBottom: '20px' }}
        ></Input>
        <TextArea
          placeholder="内容"
          autoSize={{
            minRows: 5,
          }}
          disabled={postType === 0}
          value={content}
          onChange={e => {
            dispatch({
              type: 'notice/save',
              payload: {
                content: e.target.value,
              },
            });
          }}
        />
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <span className={styles.tip} style={{ margin: 'auto 12px' }}>
            {isTop === 1 ? '该条通知将被置顶' : '该条通知不会被置顶'}
          </span>
          <Switch
            checked={isTop === 1}
            onChange={check => {
              dispatch({
                type: 'notice/save',
                payload: {
                  isTop: check ? 1 : 0,
                },
              });
            }}
          />
        </div>
        {/* 以上：输入框类型未选择时禁用，实时存储内容到state */}
      </Modal>
    );
  }
}

export default PostModal;
