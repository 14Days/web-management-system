import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Button, Modal, Form, Input } from 'antd';
import { connect } from 'dva';

@connect(({ account }) => ({
  account,
}))
export default class Find extends Component {
  // 传入所有的 user 信息, 返回符合 Table 格式的数据
  static formatData(data) {
    data.forEach((e, index) => {
      e.key = index;
      e.sex = e.sex === 0 ? '女' : '男';
    });
    return data;
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      username: '',
      password: '',
      userID: 0,
    };
    this.handlePopOK = this.handlePopOK.bind(this);
    this.handlePopCancel = this.handlePopCancel.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'account/handleInit',
    });
  }

  handlePopOK() {
    this.setState({
      visible: false,
    });

    const { username, password, userID } = this.state;

    this.props.dispatch({
      type: 'account/handleUpdate',
      payload: {
        userID,
        username,
        password,
      },
    });
  }

  handlePopCancel() {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { account } = this.props;
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: '创建者',
        dataIndex: 'create_at',
        key: 'create_at',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '操作',
        key: 'action',
        render: item => (
          <div>
            <Button
              type="primary"
              style={{ marginRight: '20px' }}
              onClick={() => {
                this.setState({
                  visible: true,
                  username: item.username,
                  password: '',
                  userID: item.key,
                });
              }}
            >
              修改
            </Button>
            <Button
              type="danger"
              onClick={() => {
                this.props.dispatch({
                  type: 'account/handleDelete',
                  payload: {
                    userID: item.key,
                  },
                });
              }}
            >
              删除
            </Button>
          </div>
        ),
      },
    ];
    return (
      <PageHeaderWrapper>
        <Modal
          title="编辑账户"
          visible={this.state.visible}
          onOk={this.handlePopOK}
          onCancel={this.handlePopCancel}
        >
          <Form layout="inline">
            <Form.Item label="用户名">
              <Input
                type="username"
                value={this.state.username}
                onChange={e => {
                  this.setState({
                    username: e.target.value,
                  });
                }}
              />
            </Form.Item>
            <Form.Item label="密码">
              <Input
                type="password"
                value={this.state.password}
                onChange={e => {
                  this.setState({
                    password: e.target.value,
                  });
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
        <Table dataSource={Find.formatData(account.user)} columns={columns} />;
      </PageHeaderWrapper>
    );
  }
}
