import {
  Affix,
  Button,
  Card,
  Col,
  Descriptions,
  Icon,
  Input,
  Modal,
  Radio,
  Row,
  Tooltip,
  Spin,
  Drawer,
  Divider,
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
    const { TextArea, Search } = Input;
    const { notice, dispatch } = this.props;
    const {
      data,
      loading,
      last,
      postType,
      postLoading,
      postView,
      content,
      count,
      currentView,
      currentNotice,
      searchDrawer,
      searchWord,
      pageNow,
      moreLoading,
      searchLoading,
    } = notice;

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
          <Row gutter={[24, 20]} align="top">
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Card bordered={false} loading={loading} className={styles.topCard}>
                <Row gutter={24}>
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
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={18} lg={18} md={18} sm={18} xs={18}>
                    <div className={styles.lastNoticeWord}>
                      <p>最新公告</p>
                    </div>
                    <Tooltip title="查看完整公告" >
                    <div
                      className={styles.lastNotice}
                      onClick={() => {
                        dispatch({
                          type: 'notice/save',
                          payload: {
                            currentNotice: 0,
                            currentView: true,
                          },
                        })
                      }}
                    >
                      <div className={styles.noticeContent}>
                        <p>{data[0].title}</p>
                      </div>
                      <div className={styles.noticeTime}>
                        <p>{`${data[0].user} 发布于 ${data[0].create_at}`}</p>
                      </div>
                    </div>
                    </Tooltip>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Affix offsetTop={20}>
              <Card className={styles.searchCard}>
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24} className={styles.send}>
                    <div>
                      <div>
                        <span style={{ fontSize: '16px' }}>{`共${count}条公告可供搜索`}</span>
                      </div>
                      <div>
                        <Search
                          placeholder="搜索公告内容..."
                          onSearch={value => console.log(value)}
                          style={{ margin: '15px auto', maxWidth: '250px' }}
                          enterButton
                          onFocus={() => {
                              dispatch({
                                type: 'notice/save',
                                payload: {
                                  searchDrawer: true,
                                },
                              })
                            }
                          }
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
              </Affix>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Card bordered={false} className={styles.postCard}>
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
            </Col>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Divider>所有公告</Divider>
            </Col>
            {data.map((item, index) => (
              <Col xl={6} lg={24} md={24} sm={24} xs={24}>
                <Card bordered={false} loading={loading} className={styles.moreCard}>
                  <Tooltip title="查看完整公告">
                    <div className={styles.moreNotice}
                      onClick={() => {
                        dispatch({
                          type: 'notice/save',
                          payload: {
                            currentNotice: index,
                            currentView: true,
                          },
                        })
                      }}
                    >
                      <div className={styles.noticeContent}>
                        <p>{item.title}</p>
                      </div>
                      <div className={styles.noticeTime}>
                        <p>{`${item.user} 发布于 ${item.create_at}`}</p>
                      </div>
                    </div>
                  </Tooltip>
                </Card>
              </Col>
            ))}
          </Row>
          <Row gutter={[24, 20]}>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Card >
                <div className={styles.moreTip} onClick={() => {
                dispatch({
                  type: 'notice/fetchMore',
                })
              }}>
                { (pageNow + 1) * 8 < count ? (
                  <div>{ moreLoading ? <Icon type="loading" style={{ margin: 'auto 5px' }}/> : <Icon type="down-circle" style={{ margin: 'auto 5px' }}/> }<span>加载更多</span></div>
                ) : (
                  <div><Icon type="check-square" style={{ margin: 'auto 5px' }}/><span>全部公告已加载，没有更多了哦~</span></div>
                ) }
                </div>
              </Card>
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
        {/* 公告详情对话框 */}
        <Modal
          visible={currentView}
          centered
          closable={false}
          title="公告详情"
          footer={[
            <Button>修改</Button>,
          ]}
          width={800}
          onCancel={() => {
            dispatch({
              type: 'notice/save',
              payload: {
                currentView: false,
              },
            });
          }}
        >
          {data.length === 0 ? '??' : data[currentNotice].title}
        </Modal>
        {/* 搜索抽屉 */}
        <Drawer
          title="公告搜索"
          width={720}
          maskClosable={searchWord === ''}
          onClose={() => {
            dispatch({
              type: 'notice/save',
              payload: {
                searchDrawer: false,
              },
            })
          }}
          visible={searchDrawer}
        >
          <Search placeholder="搜索公告内容..." loading={searchLoading} enterButton onChange={e => {
            dispatch({
              type: 'notice/save',
              payload: {
                searchWord: e.target.value,
              },
            });
            if (count <= 200) {
              dispatch({
                type: 'notice/search',
              })
            }
          }}
          onPressEnter={() => {
            dispatch({
              type: 'notice/search',
            })
          }}
          />
          <div style={{ textAlign: 'center' }}>
          <span className={styles.tip}>{count > 200 ? '总公告条数过多，已关闭自动搜索' : '已开启自动搜索' }</span>
          </div>
          <Divider>搜索结果</Divider>
          <Spin spinning={searchLoading}>
            <div style={{ width: '672px', minHeight: '300px', margin: 'auto' }}>
              <div>
                <div className={styles.searchNotice}
                      onClick={() => {
                        dispatch({
                          type: 'notice/save',
                          payload: {
                            currentNotice: 0,
                            currentView: true,
                          },
                        })
                      }}
                    >
                      <div className={styles.noticeContent}>
                        <p>{'aeuefhuiwpewpvnkdkpjfmckhgr'}</p>
                      </div>
                      <div className={styles.noticeTime}>
                        <p>{`fvsdivbilligb 发布于 hdsfhoigieuidsoiodsiv`}</p>
                      </div>
                    </div>
              </div>
            </div>
          </Spin>
        </Drawer>
        {/* 下面的是页面主体内容 */}
        {contentReal}
      </PageHeaderWrapper>
    );
  }
}

export default Notice;
