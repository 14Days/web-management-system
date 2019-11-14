import { Col, Icon, Row, Card, Statistic, Radio, Tooltip, Descriptions, Table } from 'antd';
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
      styleLike,
      styleCollect,
      styleComment,
      designerPost,
      designerFollow,
      designerComment,
      designerLike,
    } = statistics; // 抽取数据

    // 列参数
    const styleLikeColumns = [
      {
        title: '排名',
        dataIndex: 'key',
        key: 'rank',
        render: text => <span>{ `# ${text}` }</span>,
      },
      {
        title: '风格',
        dataIndex: 'tag',
        key: 'name',
      },
      {
        title: '点赞数',
        dataIndex: 'num',
        key: 'num',
      },
    ];

    const styleCommentColumns = [
      {
        title: '排名',
        dataIndex: 'key',
        key: 'rank',
        render: text => <span>{ `# ${text}` }</span>,
      },
      {
        title: '风格',
        dataIndex: 'tag',
        key: 'name',
      },
      {
        title: '评论数',
        dataIndex: 'num',
        key: 'num',
      },
    ];

    const styleCollectColumns = [
      {
        title: '排名',
        dataIndex: 'key',
        key: 'rank',
        render: text => <span>{ `# ${text}` }</span>,
      },
      {
        title: '风格',
        dataIndex: 'tag',
        key: 'name',
      },
      {
        title: '收藏数',
        dataIndex: 'num',
        key: 'num',
      },
    ];

    const designerPostColumns = [
      {
        title: '排名',
        dataIndex: 'key',
        key: 'rank',
        render: text => <span>{ `# ${text}` }</span>,
      },
      {
        title: '设计师昵称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '新增推荐数',
        dataIndex: 'num',
        key: 'num',
      },
    ];

    const designerLikeColumns = [
      {
        title: '排名',
        dataIndex: 'key',
        key: 'rank',
        render: text => <span>{ `# ${text}` }</span>,
      },
      {
        title: '设计师昵称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '新增被点赞数',
        dataIndex: 'num',
        key: 'num',
      },
    ];

    const designerFollowColumns = [
      {
        title: '排名',
        dataIndex: 'key',
        key: 'rank',
        render: text => <span>{ `# ${text}` }</span>,
      },
      {
        title: '设计师昵称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '新增被关注数',
        dataIndex: 'num',
        key: 'num',
      },
    ];

    const designerCommentColumns = [
      {
        title: '排名',
        dataIndex: 'key',
        key: 'rank',
        render: text => <span>{ `# ${text}` }</span>,
      },
      {
        title: '设计师昵称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '新增被评论数',
        dataIndex: 'num',
        key: 'num',
      },
    ];

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
            >近24时</Radio.Button>
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
            >近7日</Radio.Button>
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
            >近30日</Radio.Button>
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
      {/* 页头声明结束 */}
      {/* 具体内容开始 */}
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
          {/* 每一卡片 Rank展示前三 Table展示后七 */}
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card title="风格点赞排名" className={styles.infoCard} loading={loading} bordered={false}>
              {/* Rank：主体type 0风格 1设计师; 类型kind 内容类型 */}
              <Rank type={0} data={styleLike} kind="like"/>
              <Table columns={styleLikeColumns}
                dataSource={styleLike.slice(3, 10)}
                pagination={false}
              />
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card title="风格收藏排名" className={styles.infoCard} loading={loading} bordered={false}>
              <Rank type={0} data={styleCollect} kind="collect"/>
              <Table
                columns={styleCollectColumns}
                dataSource={styleCollect.slice(3, 10)}
                pagination={false}
              />
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card title="风格评论排名" className={styles.infoCard} loading={loading} bordered={false}>
              <Rank type={0} data={styleComment} kind="comment"/>
              <Table
                columns={styleCommentColumns}
                dataSource={styleComment.slice(3, 10)}
                pagination={false}
              />
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card title="设计师点赞排名" className={styles.infoCard} loading={loading} bordered={false}>
              <Rank type={1} data={designerLike} kind="like"/>
              <Table
                columns={designerLikeColumns}
                dataSource={designerLike.slice(3, 10)}
                pagination={false}
              />
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card title="设计师发布排名" className={styles.infoCard} loading={loading} bordered={false}>
              <Rank type={1} data={designerPost} kind="post"/>
              <Table
                columns={designerPostColumns}
                dataSource={designerPost.slice(3, 10)}
                pagination={false}
              />
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card title="设计师关注排名" className={styles.infoCard} loading={loading} bordered={false}>
              <Rank type={1} data={designerFollow} kind="follow"/>
              <Table
                columns={designerFollowColumns}
                dataSource={designerFollow.slice(3, 10)}
                pagination={false}
              />
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card title="设计师评论排名" className={styles.infoCard} loading={loading} bordered={false}>
              <Rank type={1} data={designerComment} kind="comment"/>
              <Table
                columns={designerCommentColumns}
                dataSource={designerComment.slice(3, 10)}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Statistics;
