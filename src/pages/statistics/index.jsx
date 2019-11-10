import { Col, Icon, Row, Card, Statistic, Radio, PageHeader, Descriptions } from 'antd';
import React, { Component } from 'react';
// import { connect } from 'dva';
import styles from './style.less';

class Index extends Component {
  state = {

  };

  render() {
    return (
      <Row
        gutter={24}
        type="flex"

      >
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <PageHeader
            className={styles.infoHeader}
            title="统计"
            subTitle="查看近段时间的app情况"
          >
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="最后刷新时间">{Date()}</Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <Radio.Group defaultValue="1day" className={styles.daySelect}>
            <Radio.Button value="1day">近24时</Radio.Button>
            <Radio.Button value="7days">近7日</Radio.Button>
            <Radio.Button value="30days">近30日</Radio.Button>
          </Radio.Group>
          <Card title="整体情况" className={styles.infoCard}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="新增用户" value={1128} suffix="个" className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="新增推荐" value={93} suffix="条" className={styles.infoStatistic}/>
              </Col>
            </Row>
          </Card>
          <Card title="热门风格" className={styles.infoCard}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="最高点赞风格" value={1128} className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="该风格受点赞数" value={93} prefix={<Icon type="like" />} className={styles.infoStatistic}/>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="最高收藏风格" value={1128} className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="该风格受收藏数" value={93} prefix={<Icon type="star" />} className={styles.infoStatistic}/>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="最多评论风格" value={1128} className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="该风格受评论数" value={93} prefix={<Icon type="edit" />} className={styles.infoStatistic}/>
              </Col>
            </Row>
          </Card>
          <Card title="热门设计师" className={styles.infoCard}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="最多发布设计师" value={1128} className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="该设计师发布数" value={93} prefix={<Icon type="carry-out" />} className={styles.infoStatistic}/>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="最多被关注设计师" value={1128} className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="该设计师受关注数" value={93} prefix={<Icon type="eye" />} className={styles.infoStatistic}/>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="最多被评论设计师" value={1128} className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="该设计师受评论数" value={93} prefix={<Icon type="switcher" />} className={styles.infoStatistic}/>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="最多被点赞设计师" value={1128} className={styles.infoStatistic}/>
              </Col>
              <Col span={12}>
                <Statistic title="该设计师受点赞数" value={93} prefix={<Icon type="like" />} className={styles.infoStatistic}/>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    )
  }

}

export default Index;
