import {
  Input,
  Modal,
  Switch,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './style.less';

@connect(({ notice }) => ({
  notice,
}))
class EditModal extends Component {
  render() {
    const { notice, dispatch } = this.props;
    const { editView, editTitle, editContent, editIsTop, editLoading, currentNotice } = notice;
    const { TextArea } = Input;
    let tipWord = '';
    switch (currentNotice.type) {
      case 1:
        tipWord = '这是一条管理员通知，将只管理员开放。';
        break;
      case 2:
        tipWord = '这是一条设计师通知，将只向您旗下的设计师开放。';
        break;
      case 3:
        tipWord = '这是一条用户通知，将只向App端的用户开放。';
        break;
      default:
        break;
    }
    return (
      <Modal
        zIndex={9999}
        title="修改通知"
        width={800}
        visible={editView}
        centered
        onCancel={() => {
          dispatch({
            type: 'notice/save',
            payload: {
              editView: false,
              editTitle: '',
              editContent: '',
            },
          });
        }}
        onOk={() => {
          dispatch({
            type: 'notice/handleChange',
          });
        }}
        confirmLoading={editLoading}
        maskClosable={editContent === ''}
      >
        <p>
          <span
            className={styles.tip}
          >{`正在修改${currentNotice.user}发布的通知，${tipWord}`}</span>
        </p>
        <Input
          placeholder="标题"
          value={editTitle}
          onChange={e => {
            dispatch({
              type: 'notice/save',
              payload: {
                editTitle: e.target.value,
              },
            });
          }}
          style={{ marginBottom: '20px' }}
        ></Input>
        <TextArea
          autoSize={{
            minRows: 5,
          }}
          value={editContent}
          onChange={e => {
            dispatch({
              type: 'notice/save',
              payload: {
                editContent: e.target.value,
              },
            });
          }}
        />
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <span className={styles.tip} style={{ margin: 'auto 12px' }}>
            {editIsTop > 0 ? '该条通知将被置顶' : '该条通知不会被置顶'}
          </span>
          <Switch
            checked={editIsTop > 0}
            onChange={check => {
              dispatch({
                type: 'notice/save',
                payload: {
                  editIsTop: check === false ? 0 : 1,
                },
              });
            }}
          />
        </div>
      </Modal>
    );
  }
}

export default EditModal;
