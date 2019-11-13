import React, { Component } from 'react';
import { Button, Form, Input, Spin } from 'antd';
import { connect } from 'dva';

import styles from './style.less';

class Login extends Component {
  commit = () => {
    this.props.form.validateFields(err => {
      if (!err) {
        this.props.dispatch({
          type: 'login/save',
          payload: {
            loading: true,
          },
        });
        const account = this.props.form.getFieldsValue();
        this.props.dispatch({
          type: 'login/handleLogin',
          payload: account,
        });
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.main}>
        <Spin spinning={this.props.loading} style={{ alignItems: 'center' }}>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: '请输入用户名！',
                },
              ],
            })(<Input type="username" placeholder="请输入用户名" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码！',
                },
              ],
            })(<Input type="password" placeholder="请输入密码" />)}
          </Form.Item>
          <Button className={styles.button} type="primary" onClick={this.commit}>
            登录
          </Button>
        </Spin>
      </div>
    );
  }
}

export default Form.create()(connect(state => state.login)(Login));
