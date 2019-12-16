import { Affix, Button, Card, Col, Descriptions, Divider, Icon, Input, Row, Tooltip } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Authorized from '../../utils/Authorized';

import InfoModal from './InfoModal';
import PostModal from './PostModal';
import EditModal from './EditModal';
import SearchDrawer from './SearchDrawer';

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
    const { Search } = Input;
    const { notice, dispatch } = this.props;
    const { last, loading, count, data, pageNow, moreLoading } = notice;

    // 显示的主体内容
    let contentReal = <div />;
    if (data.length !== 0) {
      // 当获取到的data为长度不为0时（历史上存在通知）
      contentReal = (
        <React.Fragment>
          <Row gutter={[24, 20]} align="top">
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Card bordered={false} loading={loading} className={styles.topCard}>
                <Row gutter={24}>
                  {/* 日期显示 */}
                  <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                    <Row type="flex" justify="center" align="middle">
                      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <div className={styles.time}>
                          <div className={styles.year}>
                            <span>{last.slice(11, 15)}</span>
                          </div>
                          <div className={styles.date}>
                            <span className={styles.month}>{last.slice(4, 7)}</span>
                            <span className={styles.day}>{last.slice(8, 10)}</span>
                          </div>
                          <div className={styles.tipsWord}>
                            <span>最新通知</span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  {/* 最新通知栏 */}
                  <Col xl={18} lg={18} md={18} sm={18} xs={18}>
                    {/* 最新通知内容 */}
                    <Tooltip title="查看完整通知">
                      <div
                        className={styles.lastNotice}
                        onClick={() => {
                          dispatch({
                            type: 'notice/fetchInfo',
                            payload: {
                              currentId: data[0].id,
                            },
                          });
                        }}
                      >
                        <div className={styles.noticeTitle}>
                          <p>{data[0].title}</p>
                        </div>
                        <div className={styles.noticeContent}>
                          <p>{data[0].content}</p>
                        </div>
                        <div className={styles.noticeTime}>
                          <p>
                            {data[0].user_type === 1
                              ? '由超级管理员发布的通知'
                              : '由管理员发布的通知'}
                          </p>
                          <p>{`${data[0].user} 发布于 ${data[0].create_at}`}</p>
                        </div>
                      </div>
                    </Tooltip>
                  </Col>
                </Row>
              </Card>
            </Col>
            {/* 搜索栏 */}
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Affix offsetTop={80}>
                <Card className={styles.searchCard}>
                  <Row>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24} className={styles.send}>
                      <div>
                        <div>
                          <span style={{ fontSize: '16px' }}>{`共${count}条通知可供搜索`}</span>
                        </div>
                        <div>
                          <Search
                            placeholder="搜索通知标题..."
                            style={{
                              margin: '15px auto',
                              maxWidth: '250px',
                            }}
                            enterButton
                            onFocus={() => {
                              dispatch({
                                type: 'notice/save',
                                payload: {
                                  searchDrawer: true,
                                },
                              });
                            }}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Affix>
            </Col>
            {/* 发布栏 */}
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Card bordered={false} className={styles.postCard}>
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24} className={styles.send}>
                    <div>
                      <p>有新情况？发布一下吧</p>
                      {/* 分权限亮起按钮 */}
                      <Authorized
                        authority={['admin', 'root']}
                        noMatch={
                          <Tooltip title="没有权限😜">
                            <Button type="primary" icon="form" disabled>
                              发布通知
                            </Button>
                          </Tooltip>
                        }
                      >
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
                          发布通知
                        </Button>
                      </Authorized>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Divider>所有通知</Divider>
            </Col>
            {/* 所有通知贴纸内容 */}
            {data.map(item => (
              <Col xl={6} lg={24} md={24} sm={24} xs={24}>
                <Card
                  bordered={false}
                  loading={loading}
                  className={styles.moreCard}
                  style={item.is_top > 0 ? { backgroundColor: 'rgb(74, 168, 255)' } : {}}
                >
                  <Tooltip title="查看完整通知">
                    <div
                      className={item.is_top > 0 ? styles.topNotice : styles.moreNotice}
                      onClick={() => {
                        dispatch({
                          type: 'notice/fetchInfo',
                          payload: {
                            currentId: item.id,
                          },
                        });
                      }}
                    >
                      <div>
                        {item.is_top > 0 ? (
                          <span
                            className={styles.tip}
                            style={{ color: 'rgba(255,255,255,0.65)', margin: 'auto 16px' }}
                          >
                            <Icon type="caret-up" />
                            置顶通知
                          </span>
                        ) : (
                          <div />
                        )}
                      </div>
                      <div className={styles.noticeTitle}>
                        <p>{item.title}</p>
                      </div>
                      <div
                        className={styles.noticeContent}
                        style={item.is_top > 0 ? { maxHeight: '175px' } : { maxHeight: '200px' }}
                      >
                        <p>{item.content}</p>
                      </div>
                      <div className={styles.noticeTime}>
                        <p>{item.user_type === 1 ? '超管发布' : '管理发布'}</p>
                        <p>{`${item.user} 发布于 ${item.create_at}`}</p>
                      </div>
                    </div>
                  </Tooltip>
                </Card>
              </Col>
            ))}
          </Row>
          {/* 加载更多栏 */}
          <Row gutter={[24, 20]}>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Card>
                <div
                  className={styles.moreTip}
                  onClick={() => {
                    dispatch({
                      type: 'notice/fetchMore',
                    });
                  }}
                >
                  {(pageNow + 1) * 8 < count ? (
                    <div>
                      {moreLoading ? (
                        <Icon type="loading" style={{ margin: 'auto 5px' }} />
                      ) : (
                        <Icon type="down-circle" style={{ margin: 'auto 5px' }} />
                      )}
                      <span>加载更多</span>
                    </div>
                  ) : (
                    <div>
                      <Icon type="check-square" style={{ margin: 'auto 5px' }} />
                      <span>全部通知已加载，没有更多了哦~</span>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </React.Fragment>
      );
    } else {
      // 当获取到的data为长度为0时（历史上没有任何通知）
      contentReal = (
        <React.Fragment>
          <Row gutter={24}>
            <Col>
              <Card>
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24} className={styles.send}>
                    <div>
                      <p>一条通知都没有哦，发布一下吧</p>
                      {/* 分权限亮起按钮 */}
                      <Authorized
                        authority={['admin', 'root']}
                        noMatch={
                          <Tooltip title="没有权限😜">
                            <Button type="primary" icon="form" disabled>
                              发布通知
                            </Button>
                          </Tooltip>
                        }
                      >
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
                          发布通知
                        </Button>
                      </Authorized>
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
        title="通知信息"
        subTitle="查看并发布通知信息"
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
        {/* 通知发布对话框 */}
        <PostModal />
        {/* 编辑对话框 */}
        <EditModal />
        {/* 通知详情对话框 */}
        <InfoModal />
        {/* 搜索抽屉 */}
        <SearchDrawer />
        {/* 下面的是页面主体内容 */}
        {contentReal}
      </PageHeaderWrapper>
    );
  }
}

export default Notice;
