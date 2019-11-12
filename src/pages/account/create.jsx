import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Input, Button, Spin } from 'antd';
import { connect } from 'dva';

class Create extends Component {
  constructor(props) {
    super(props);
    this.commit = this.commit.bind(this);
  }

  commit = () => {
    this.props.form.validateFields(err => {
      if (!err) {
        this.props.dispatch({
          type: 'account/triggerLoading',
          payload: {
            page: 'create',
          },
        });
        const account = this.props.form.getFieldsValue();
        this.props.dispatch({
          type: 'account/handleCreate',
          payload: account,
        });
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderWrapper>
        <Spin spinning={this.props.loading.create}>
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
          <Button type="primary" onClick={this.commit}>
            确认提交
          </Button>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(connect(state => state.account)(Create));
