import { Col, Icon, Row, Card, Statistic, Radio, Tooltip, Descriptions, Table, Tag } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import Rank from './Rank';

@connect(({ statistics }) => ({
  statistics,
}))
class Statistics extends Component {
  state = {};

  columns = [
    {
      title: '排名',
      dataIndex: 'key',
      key: 'rank',
    },
    {
      title: '设计师昵称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '受点赞数',
      dataIndex: 'num',
      key: 'num',
    },
  ];

  data = [
    {
      key: '1',
      name: 'nihao',
      num: 23,
    },
    {
      key: '2',
      name: 'sobuhao',
      num: 24,
    },
    {
      key: '3',
      name: 'niao',
      num: 25,
    },
  ];

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'statistics/refresh',
    });
  }

  render() {
    const { statistics, dispatch } = this.props; // 从props拉出数据和dispatch
    const {
      last, // 最后更新时间
      loading,
      interval,
      numNewuser,
      numNewrecommend,
      nameStylelike,
      numStylelike,
      nameStylecollect,
      numStylecollect,
      nameStylecomment,
      numStylecomment,
      nameDesignpost,
      numDesignpost,
      nameDesignfollow,
      numDesignfollow,
      nameDesigncomment,
      numDesigncomment,
      nameDesignlike,
      numDesignlike,
    } = statistics; // 抽取数据

    return (
      <PageHeaderWrapper
        title="统计"
        subTitle="查看近段时间的app概况"
        extra={[
          // 右上角切换间隔按钮组
          <Radio.Group value={interval} className={styles.daySelect}>
            <Radio.Button
              value={1}
              onClick={() => {
                dispatch({
                  type: 'statistics/fetch',
                  payload: {
                    interval: 1,
                  },
                });
              }}
            >
              近24时
            </Radio.Button>
            <Radio.Button
              value={7}
              onClick={() => {
                dispatch({
                  type: 'statistics/fetch',
                  payload: {
                    interval: 7,
                  },
                });
              }}
            >
              近7日
            </Radio.Button>
            <Radio.Button
              value={30}
              onClick={() => {
                dispatch({
                  type: 'statistics/fetch',
                  payload: {
                    interval: 30,
                  },
                });
              }}
            >
              近30日
            </Radio.Button>
          </Radio.Group>,
        ]}
        content={[
          // 最后更新时间行
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="最后刷新时间">
              {last}
              <Tooltip
                title="刷新"
                onClick={() => {
                  dispatch({
                    type: 'statistics/refresh',
                  });
                }}
              >
                <Icon type="sync" spin={loading} style={{ margin: 'auto 10px' }} />
              </Tooltip>
            </Descriptions.Item>
          </Descriptions>,
        ]}
      >
        <Row gutter={24} type="flex">
          {/* 每个分组是一个card */}
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card title="整体情况" className={styles.infoCard} loading={loading} bordered={false}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="新增用户"
                    value={numNewuser}
                    suffix="个"
                    className={styles.infoStatistic}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="新增推荐"
                    value={numNewrecommend}
                    suffix="条"
                    className={styles.infoStatistic}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card title='风格点赞排名' className={styles.infoCard} loading={loading} bordered={false}>
              <Rank hello={123}/>
              <Table columns={this.columns} dataSource={this.data} pagination={false}/>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card title='风格评论排名' className={styles.infoCard} loading={loading} bordered={false}>
              <Rank hello={123}/>
              <Table columns={this.columns} dataSource={this.data} pagination={false}/>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card title='风格收藏排名' className={styles.infoCard} loading={loading} bordered={false}>
              <Rank hello={123}/>
              <Table columns={this.columns} dataSource={this.data} pagination={false}/>
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card title='设计师发布排名' className={styles.infoCard} loading={loading} bordered={false}>
              <Rank hello={123}/>
              <Table columns={this.columns} dataSource={this.data} pagination={false}/>
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card title='设计师关注排名' className={styles.infoCard} loading={loading} bordered={false}>
              <Rank hello={123}/>
              <Table columns={this.columns} dataSource={this.data} pagination={false}/>
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card title='设计师评论排名' className={styles.infoCard} loading={loading} bordered={false}>
              <Rank hello={123}/>
              <Table columns={this.columns} dataSource={this.data} pagination={false}/>
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card title='设计师点赞排名' className={styles.infoCard} loading={loading} bordered={false}>
              <Rank hello={123}/>
              <Table columns={this.columns} dataSource={this.data} pagination={false}/>
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Statistics;
