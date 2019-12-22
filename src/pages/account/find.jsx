import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Form, Input, Modal, Popconfirm, Spin, Table } from 'antd';
import { connect } from 'dva';
import { showNotification } from '../../utils/common';

@connect(({ account }) => ({
  ...account,
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
      password: '',
      passwordConfirm: '',
      index: 0,
      selectID: 0,
    };
    this.handlePopOK = this.handlePopOK.bind(this);
    this.handlePopCancel = this.handlePopCancel.bind(this);
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'account/handleInit',
    });
  }

  search(key) {
    const { dispatch } = this.props;
    // 显示加载中
    dispatch({
      type: 'account/triggerLoading',
      payload: {
        page: 'find',
      },
    });

    dispatch({
      type: 'account/handleSearch',
      payload: {
        key,
      },
    });
  }

  handlePopOK() {
    const { password, passwordConfirm, index, selectID } = this.state;
    if (password === '') {
      showNotification('error', '输入为空');
      return;
    }
    if (password !== passwordConfirm) {
      showNotification('error', '两次输入密码不一致！');
      this.setState({ passwordConfirm: '' });
      return;
    }
    this.setState({
      visible: false,
    });
    this.props.dispatch({
      type: 'account/handleUpdate',
      payload: {
        index,
        selectID,
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
    const {
      loading: { find },
      user,
    } = this.props;
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
        title: '创建时间',
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
                  password: '',
                  index: item.key,
                  selectID: item.id,
                });
              }}
            >
              修改
            </Button>
            <Popconfirm
              title={`确定删除此账户(${item.username})吗？`}
              onConfirm={() => {
                this.props.dispatch({
                  type: 'account/handleDelete',
                  payload: {
                    userID: item.id,
                    index: item.key,
                  },
                });
              }}
            >
              <Button type="danger">删除</Button>
            </Popconfirm>
            ,
          </div>
        ),
      },
    ];
    return (
      <PageHeaderWrapper>
        <Spin spinning={find}>
          {/* 弹出的编辑框 */}
          <Modal
            title="编辑账户"
            visible={this.state.visible}
            onOk={this.handlePopOK}
            onCancel={this.handlePopCancel}
          >
            <Form layout="inline">
              <Form.Item label="修改密码">
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
              <Form.Item label="确认密码">
                <Input
                  type="password"
                  value={this.state.passwordConfirm}
                  onChange={e => {
                    this.setState({
                      passwordConfirm: e.target.value,
                    });
                  }}
                />
              </Form.Item>
            </Form>
          </Modal>
          {/* 查找用户 */}
          <Input.Search
            placeholder="请输入要查找的用户名, 为空则列出所有用户。"
            enterButton="Search"
            size="large"
            style={{ marginBottom: '20px' }}
            onSearch={this.search}
          />
          <Table dataSource={Find.formatData(user)} columns={columns} />
        </Spin>
      </PageHeaderWrapper>
    );
  }
}
