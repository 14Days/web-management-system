import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Form, Input, Radio, Spin, Upload } from 'antd';
import { connect } from 'dva';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: undefined,
    };
    this.commit = this.commit.bind(this);
  }

  commit = () => {
    console.log('props', this.props);
    console.log('state', this.state);
    console.log(this.props.form.getFieldsValue());

    // TODO 提交信息
  };

  normFile = e => {
    this.setState({
      file: e.file.originFileObj,
    });
    const t = e.fileList.pop();
    this.getBase64(t.originFileObj);
  };

  handleUploadAvatar = () => {};

  getBase64 = img => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => {
      this.props.form.setFieldsValue({ avatar: reader.result });
    };
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { currentUser } = this.props;
    return (
      <PageHeaderWrapper title="账号设置" subTitle="设置您的个人信息">
        <Spin spinning={false}>
          <Form.Item label="头像(点击上传新头像)">
            {getFieldDecorator('avatar', {
              rules: [
                {
                  required: false,
                },
              ],
            })(
              <Upload
                name="avatar"
                accept=".png,.jpg,jpeg"
                listType="picture-card"
                showUploadList={false}
                customRequest={this.handleUploadAvatar}
                onChange={this.normFile}
              >
                {/* 未上传时显示已有头像，上传后显示上传图片 */}
                <img
                  src={this.props.form.getFieldsValue().avatar || currentUser.avatar.name}
                  alt="avatar"
                  width={300}
                  height={300}
                  style={{ borderRadius: 300 }}
                />
              </Upload>,
            )}
          </Form.Item>
          <Form.Item label="用户名">
            <Input type="username" placeholder={currentUser.name} disabled />
          </Form.Item>
          <Form.Item label="姓名">
            {getFieldDecorator('nickname', {
              rules: [
                {
                  required: true,
                  message: '请输入密码！',
                },
              ],
              initialValue: currentUser.nickname,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="性别">
            {getFieldDecorator('sex', {
              initialValue: '男',
            })(
              <Radio.Group>
                <Radio value="男">男</Radio>
                <Radio value="女">女</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label="邮箱">
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: '请输入邮箱！',
                },
              ],
              initialValue: currentUser.email,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="手机号">
            {getFieldDecorator('phone', {
              rules: [
                {
                  required: true,
                  message: '手机号不能为空',
                },
              ],
              initialValue: currentUser.phone,
            })(<Input />)}
          </Form.Item>

          <Button type="primary" onClick={this.commit}>
            确认提交
          </Button>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(connect(state => state.user)(Create));
