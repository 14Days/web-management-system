import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Form, Input, Radio, Upload } from 'antd';
import { connect } from 'dva';

import styles from './settings.less';
import { showNotification } from '../../utils/common';

class Create extends Component {
  constructor(props) {
    super(props);
    // file 是已经上传的图像的 File 对象
    this.state = {
      file: undefined,
    };
    const userID = sessionStorage.getItem('userID');
    if (userID) {
      this.props.dispatch({
        type: 'login/fetchUserInfo',
        payload: userID,
      });
    }
  }

  componentWillMount() {}

  commit = () => {
    const valid = this.props.form.validateFields();
    valid.then(
      () => {
        //  TODO 上传的时候太慢了，最好带个 loading
        const commitData = this.props.form.getFieldsValue();
        // 如果上传了的话，添加这个属性
        commitData.avatarFile = this.state.file;
        commitData.avatar = {
          old_id: this.props.currentUser.avatar.id,
          new_id: this.props.currentUser.avatar.id,
        };

        const { userid } = this.props.currentUser;
        // 提交所有表单信息 {nickname, sex<number>, email, phone, avatar<File>, old_avatar_id}
        // avatar 需要判断是否上传了新的头像，其他的不需要
        this.props.dispatch({
          type: 'account/handleSettings',
          payload: {
            userid,
            info: commitData,
          },
        });
      },
      err => {
        Object.keys(err.errors).forEach(prop => {
          showNotification('error', err.errors[prop].errors[0].message);
        });
      },
    );
  };

  /**
   * 上传动作触发
   * 将文件对象放在 state 里面
   * 上传后 pop 掉上次上传的然后调用 getBase64 使页面上显示当前图像。
   */
  normFile = e => {
    this.setState({
      file: e.file.originFileObj,
    });
    const t = e.fileList.pop();
    this.getBase64(t.originFileObj);
  };

  getBase64 = img => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    // 将表单中的 avatar 设置为 reader 后的 database64，显示在页面上.
    reader.onload = () => {
      this.props.form.setFieldsValue({ avatar: reader.result });
    };
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const currentUser = JSON.parse(sessionStorage.getItem('userInfo'));
    return (
      <PageHeaderWrapper title="账号设置" subTitle="设置您的个人信息">
        <div className={styles.formContainer}>
          <Form.Item label="头像(点击上传新头像)" className={styles.item}>
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
          <Form.Item label="用户名" className={styles.item}>
            <Input type="username" placeholder={currentUser.username} disabled />
          </Form.Item>
          <Form.Item label="姓名" className={styles.item}>
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
          <Form.Item label="性别" className={styles.item}>
            {getFieldDecorator('sex', {
              initialValue: currentUser.sex,
            })(
              <Radio.Group>
                <Radio value={1}>男</Radio>
                <Radio value={0}>女</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label="邮箱" className={styles.item}>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: '请输入邮箱！',
                },
                {
                  pattern: /^[A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                  message: '请输入合法的邮箱!',
                },
              ],
              initialValue: currentUser.email,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="手机号" className={styles.item}>
            {getFieldDecorator('phone', {
              rules: [
                {
                  required: true,
                  message: '手机号不能为空',
                },
                {
                  pattern: /^1[356789]\d{9}$/,
                  message: '手机号不合法！',
                },
              ],
              initialValue: currentUser.phone,
            })(<Input />)}
          </Form.Item>

          <Button type="primary" onClick={this.commit} className={styles.btn}>
            确认提交
          </Button>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(connect(state => state.user)(Create));
