import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Button } from 'antd';
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

  componentWillMount() {
    this.props.dispatch({
      type: 'account/handleInit',
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
            <Button type="primary" style={{ marginRight: '20px' }}>
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
        <Table dataSource={Find.formatData(account.user)} columns={columns} />;
      </PageHeaderWrapper>
    );
  }
}
