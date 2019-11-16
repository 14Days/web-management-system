import {
  Affix,
  Button,
  Card,
  Col,
  Descriptions,
  Icon,
  Input,
  List,
  Modal,
  Radio,
  Row,
  Tooltip,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';

@connect(({ notice }) => ({
  notice,
}))
class Notice extends Component {
  state = {};

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'notice/refresh',
    });
  }

  render() {
    const { TextArea } = Input;
    const { notice, dispatch } = this.props;
    const { data, loading, last, postType, postLoading, postView, content, count } = notice;

    // 发布公告对话框中的提示内容
    let tipsWord = (
      <span className={styles.tip} style={{ color: 'red' }}>
        <Icon type="exclamation-circle" style={{ margin: '0 5px' }} />
        请先选择发送的公告类型
      </span>
    );
    switch (postType) {
      case 1:
        tipsWord = (
          <span className={styles.tip}>
            把公告发送给Web后台，只有Web后台的设计师和管理员能看到这则公告
          </span>
        );
        break;
      case 2:
        tipsWord = (
          <span className={styles.tip}>把公告发送给App应用，App应用的用户将看到这则公告</span>
        );
        break;
      default:
        break;
    }

    // 显示的主体内容
    let contentReal = <div />;
    if (data.length !== 0) {
      // 当获取到的data为长度不为0时（历史上存在公告）
      contentReal = (
        <React.Fragment>
          <Row gutter={24}>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Card title="当前公告" bordered={false} className={styles.infoCard} loading={loading}>
                <Row gutter={24}>
                  <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                    <Row type="flex" justify="center" align="middle">
                      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <div className={styles.time}>
                          <div className={styles.year}>
                            <span>{data[0].create_at.slice(12, 16)}</span>
                          </div>
                          <div className={styles.date}>
                            <span className={styles.month}>{data[0].create_at.slice(8, 11)}</span>
                            <span className={styles.day}>{data[0].create_at.slice(5, 7)}</span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={20} lg={20} md={20} sm={20} xs={20}>
                    <div className={styles.mainContent}>
                      <p>{data[0].title}</p>
                    </div>
                    <div>
                      <p>{`${data[0].user} 发布于 ${data[0].create_at}`}</p>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Card title="历史公告" bordered={false} loading={loading} extra={<span className={styles.tip}>{`共 ${count} 条公告`}</span>}>
                <List
                  itemLayout="horizontal"
                  dataSource={data}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta title={`${item.user} 发布于 ${item.create_at}`} description={item.title} />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Affix offsetTop={10} offsetBottom={10}>
                <Card bordered={false}>
                  <Row>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24} className={styles.send}>
                      <div>
                        <p>有新情况？发布一下吧</p>
                        <Button
                          type="primary"
                          icon="form"
                          onClick={() => {
                            dispatch({
                              type: 'notice/save',
                              payload: {
                                postView: true,
                              },
                            });
                          }}
                        >
                          发布公告
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Affix>
            </Col>
          </Row>
        </React.Fragment>
      );
    } else {
      // 当获取到的data为长度为0时（历史上没有任何公告）
      contentReal = (
        <React.Fragment>
          <Row gutter={24}>
            <Col>
              <Card>
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24} className={styles.send}>
                    <div>
                      <p>一条公告都没有哦，发布一下吧</p>
                      <Button
                        type="primary"
                        icon="form"
                        onClick={() => {
                          dispatch({
                            type: 'notice/save',
                            payload: {
                              postView: true,
                            },
                          });
                        }}
                      >
                        发布公告
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </React.Fragment>
      );
    }

    return (
      <PageHeaderWrapper
        title="公告信息"
        subTitle="查看并发布公告信息"
        content={[
          // 最后更新时间行
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="最后刷新时间">
              {last}
              <Tooltip
                title="刷新"
                onClick={() => {
                  dispatch({
                    type: 'notice/refresh',
                  });
                }}
              >
                <Icon type="sync" spin={loading} style={{ margin: 'auto 10px' }} />
              </Tooltip>
            </Descriptions.Item>
          </Descriptions>,
        ]}
      >
        {/* 公告发布对话框 */}
        <Modal
          visible={postView}
          centered
          maskClosable={false}
          closable={!postLoading}
          title="发布公告"
          footer={
            <Button
              loading={postLoading}
              disabled={postType === 0 || content === ''}
              onClick={() => {
                dispatch({
                  type: 'notice/send',
                });
              }}
            >
              发布
            </Button>
          }
          width={800}
          onCancel={() => {
            dispatch({
              type: 'notice/exitPost',
            });
          }}
        >
          {/* 以上：自定义框底组件（发布按钮），退出时清空相关变量， 发送时不允许关闭对话框 */}
          {/* 发布类型选择 */}
          <Radio.Group value={postType} className={styles.typeSelect}>
            <Radio.Button
              value={1}
              onClick={() => {
                dispatch({
                  type: 'notice/save',
                  payload: {
                    postType: 1,
                  },
                });
              }}
            >
              Web后台公告
            </Radio.Button>
            <Radio.Button
              value={2}
              onClick={() => {
                dispatch({
                  type: 'notice/save',
                  payload: {
                    postType: 2,
                  },
                });
              }}
            >
              App公告
            </Radio.Button>
          </Radio.Group>
          {/* 下面的是提示词 */}
          {tipsWord}
          <TextArea
            autoSize={{
              maxRows: 5,
              minRows: 5,
            }}
            disabled={postType === 0}
            value={content}
            onChange={e => {
              dispatch({
                type: 'notice/save',
                payload: {
                  content: e.target.value,
                },
              });
            }}
          />
          {/* 以上：输入框类型未选择时禁用，实时存储内容到state */}
        </Modal>
        {/* 下面的是页面主体内容 */}
        {contentReal}
      </PageHeaderWrapper>
    );
  }
}

export default Notice;
