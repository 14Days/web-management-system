import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Input, Button, Spin } from 'antd';

class Create extends Component {
  constructor(props) {
    super(props);
    this.commit = this.commit.bind(this);
  }

  commit = () => {
    console.log(this.props);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderWrapper title="账号设置" subTitle="设置您的个人信息">
        <Spin spinning={false}>
          <Form.Item label="头像"></Form.Item>
          <Form.Item label="用户名">
            {getFieldDecorator('username', {
              rules: [
                {
                  required: false,
                },
              ],
            })(<Input type="username" placeholder="您的用户名" disabled />)}
          </Form.Item>
          <Form.Item label="创建者">
            {getFieldDecorator('username', {
              rules: [
                {
                  required: false,
                },
              ],
            })(<Input type="username" placeholder="创建者" disabled />)}
          </Form.Item>
          <Form.Item label="姓名">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码！',
                },
              ],
            })(<Input placeholder="您的姓名" />)}
          </Form.Item>
          <Form.Item label="性别"></Form.Item>
          <Form.Item label="邮箱"></Form.Item>
          <Form.Item label="手机号"></Form.Item>

          <Button type="primary" onClick={this.commit}>
            确认提交
          </Button>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Create);
