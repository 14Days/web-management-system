import {
  Affix,
  Button,
  Card,
  Col,
  Descriptions,
  Icon,
  Input,
  Modal,
  Radio,
  Row,
  Tooltip,
  Spin,
  Drawer,
  Divider,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import { connect } from 'dva';
import Authorized from '../../utils/Authorized';
import styles from './style.less';

class Spider extends Component {
  state = {};

  render() {
    return (
      <PageHeaderWrapper title="爬虫管理">
        <div>hello</div>
      </PageHeaderWrapper>
    );
  }
}

export default Spider;
