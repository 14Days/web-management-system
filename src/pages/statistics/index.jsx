import { Col, Icon, Row, Card, Statistic, Radio, Tooltip, Descriptions, Skeleton } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { connect } from 'dva';
import styles from './style.less';

@connect(({ statistics }) => ({
  statistics,
}))
class Index extends Component {
  state = {

  };

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
            <Radio.Button value={1} onClick={() => {
              dispatch({
                type: 'statistics/fetch',
                payload: {
                  interval: 1,
                },
              });
            }}>近24时</Radio.Button>
            <Radio.Button value={7} onClick={() => {
              dispatch({
                type: 'statistics/fetch',
                payload: {
                  interval: 7,
                },
              });
            }}>近7日</Radio.Button>
            <Radio.Button value={30} onClick={() => {
              dispatch({
                type: 'statistics/fetch',
                payload: {
                  interval: 30,
                },
              });
            }}>近30日</Radio.Button>
        </Radio.Group>,
      ]}
      content={[
        // 最后更新时间行
        <Descriptions size="small" column={1}>
          <Descriptions.Item label="最后刷新时间">
            {last}
            <Tooltip title="刷新" onClick={() => {
                dispatch({
                  type: 'statistics/refresh',
                });
              }}>
              <Icon type="sync" spin={loading} style={{ margin: 'auto 10px' }}/>
            </Tooltip></Descriptions.Item>
        </Descriptions>,
      ]}
      >
      <Row
        gutter={24}
        type="flex"

      >
        {/* 每个分组是一个card */}
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Card title="整体情况" className={styles.infoCard} loading={loading} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="新增用户" value={numNewuser} suffix="个" className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="新增推荐" value={numNewrecommend} suffix="条" className={styles.infoStatistic}/>
              </Col>
            </Row>
          </Card>
          <Card title="热门风格" className={styles.infoCard} loading={loading} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="最高点赞风格" value={nameStylelike} className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="该风格受点赞数" value={numStylelike} prefix={<Icon type="like" />} className={styles.infoStatistic}/>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="最高收藏风格" value={nameStylecollect} className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="该风格受收藏数" value={numStylecollect} prefix={<Icon type="star" />} className={styles.infoStatistic}/>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="最多评论风格" value={nameStylecomment} className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="该风格受评论数" value={numStylecomment} prefix={<Icon type="message" />} className={styles.infoStatistic}/>
              </Col>
            </Row>
          </Card>
          <Card title="热门设计师" className={styles.infoCard} loading={loading} bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="最多发布设计师" value={nameDesignpost} className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="该设计师发布数" value={numDesignpost} prefix={<Icon type="carry-out" />} className={styles.infoStatistic}/>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="最多被关注设计师" value={nameDesignfollow} className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="该设计师受关注数" value={numDesignfollow} prefix={<Icon type="eye" />} className={styles.infoStatistic}/>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="最多被评论设计师" value={nameDesigncomment} className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="该设计师受评论数" value={numDesigncomment} prefix={<Icon type="message" />} className={styles.infoStatistic}/>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="最多被点赞设计师" value={nameDesignlike} className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="该设计师受点赞数" value={numDesignlike} prefix={<Icon type="like" />} className={styles.infoStatistic}/>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      </PageHeaderWrapper>
    )
  }
}

connect(state => state.work)(Index);

export default Index;
