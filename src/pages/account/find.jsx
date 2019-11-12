import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Button } from 'antd';

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
    render: () => (
      <div>
        <Button type="primary" style={{ marginRight: '20px' }}>
          修改
        </Button>
        <Button type="danger">删除</Button>
      </div>
    ),
  },
];

const dataSource = [
  {
    key: '1',
    username: 'qkuns',
    nickname: '秦志杰',
    create_at: '王神',
    sex: '男',
  },
  {
    key: '2',
    username: 'wangjq',
    nickname: '王锦权',
    create_at: '顾总',
    sex: '男',
  },
];

export default () => (
  <PageHeaderWrapper>
    <Table dataSource={dataSource} columns={columns} />;
  </PageHeaderWrapper>
);
