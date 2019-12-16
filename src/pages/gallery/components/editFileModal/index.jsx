import {
  Affix,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Icon,
  Input,
  Modal,
  Row,
  Select,
  Tooltip,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
// import Authorized from '../../utils/Authorized';

import styles from './style.less';

function EditFileModal() {
  return (
    <Modal
      title="更改图集名称"
      visible={editFileState}
      onOk={() => {
        dispatch({
          type: 'gallery/dealRenameFile',
        })
      }}
      onCancel={() => {
        dispatch({
          type: 'gallery/save',
          payload: {
            editFileState: false,
          },
        })
      }}
    >
      <Input
        value={editFile.name}
        onChange={e => {
          dispatch({
            type: 'gallery/saveFileName',
            payload: {
              name: e.target.value,
            },
          })
        }}
      />
    </Modal>
  )
}
