import {
  Affix,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Icon,
  Input,
  Modal,
  Radio,
  Row,
  Spin,
  Drawer,
  Divider,
  Popconfirm,
  Switch,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Authorized from '../../utils/Authorized';
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
      last,
      loading,
      count,
      data,
      pageNow,
      moreLoading,
      postType,
      postLoading,
      postView,
      title,
      content,
      isTop,
      currentView,
      currentId,
      currentNotice,
      currentLoading,
      deleteLoading,
      searchDrawer,
      searchWord,
      searchLoading,
      searchRes,
      editTitle,
      editContent,
      editIsTop,
      editView,
      editLoading,
    } = notice;

    // 发布通知对话框中的提示内容
    let tipsWord = (
      <span className={styles.tip} style={{ color: 'red' }}>
        <Icon type="exclamation-circle" style={{ margin: '0 5px' }} />
        请先选择发送的通知类型
      </span>
    );
    switch (postType) {
      case 1:
        tipsWord = (
          <span className={styles.tip}>把通知发送给Web后台，所有设计师和管理员将看到这则通知</span>
        );
        break;
      case 2:
        tipsWord = (
          <span className={styles.tip}>把通知发送给设计师，您旗下的设计师将看到这则通知</span>
        );
        break;
      case 3:
        tipsWord = (
          <span className={styles.tip}>把通知发送给App应用，App应用的用户将看到这则通知</span>
        );
        break;
      default:
        break;
    }

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
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  {/* 最新通知栏 */}
                  <Col xl={18} lg={18} md={18} sm={18} xs={18}>
                    <div className={styles.lastNoticeWord}>
                      <p>最新通知</p>
                    </div>
                    {/* 最新通知内容 */}
                    <Tooltip title="查看完整通知">
                      <div
                        className={styles.lastNotice}
                        style={
                          data[0].is_top > 0 ? { backgroundColor: 'rgba(173, 226, 255, 0.32)' } : {}
                        }
                        onClick={() => {
                          dispatch({
                            type: 'notice/fetchInfo',
                            payload: {
                              currentId: data[0].notice_id,
                            },
                          });
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
            {/* 搜索栏 */}
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
                  style={item.is_top > 0 ? { backgroundColor: 'rgba(173, 226, 255, 0.32)' } : {}}
                >
                  <Tooltip title="查看完整通知">
                    <div
                      className={styles.moreNotice}
                      onClick={() => {
                        dispatch({
                          type: 'notice/fetchInfo',
                          payload: {
                            currentId: item.notice_id,
                          },
                        });
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
        <Modal
          visible={postView}
          centered
          maskClosable={false}
          closable={!postLoading}
          title="发布通知"
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
            {/* 管理员通知需要权限判定 */}
            <Authorized
              authority={['root']}
              noMatch={
                <Tooltip title="没有权限😜">
                  <Radio.Button disabled>管理员通知</Radio.Button>
                </Tooltip>
              }
            >
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
                管理员通知
              </Radio.Button>
            </Authorized>
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
              设计师通知
            </Radio.Button>
            <Radio.Button
              value={3}
              onClick={() => {
                dispatch({
                  type: 'notice/save',
                  payload: {
                    postType: 3,
                  },
                });
              }}
            >
              用户通知
            </Radio.Button>
          </Radio.Group>
          {/* 下面的是提示词 */}
          {tipsWord}
          <br />
          <Input
            placeholder="标题"
            disabled={postType === 0}
            onChange={e => {
              dispatch({
                type: 'notice/save',
                payload: {
                  title: e.target.value,
                },
              });
            }}
            style={{ marginBottom: '20px' }}
          ></Input>
          <TextArea
            placeholder="内容"
            autoSize={{
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
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <span className={styles.tip} style={{ margin: 'auto 12px' }}>
              {isTop ? '该条通知将被置顶' : '该条通知不会被置顶'}
            </span>
            <Switch
              checked={isTop}
              onChange={check => {
                dispatch({
                  type: 'notice/save',
                  payload: {
                    isTop: check,
                  },
                });
              }}
            />
          </div>
          {/* 以上：输入框类型未选择时禁用，实时存储内容到state */}
        </Modal>
        {/* 编辑对话框显示 */}
        <Modal
          zIndex={9999}
          title="修改通知"
          width={800}
          visible={editView}
          centered
          onCancel={() => {
            dispatch({
              type: 'notice/save',
              payload: {
                editView: false,
                editTitle: '',
                editContent: '',
              },
            });
          }}
          onOk={() => {
            dispatch({
              type: 'notice/handleChange',
            });
          }}
          confirmLoading={editLoading}
          maskClosable={editContent === ''}
        >
          <p>
            <span className={styles.tip}>{`正在修改${currentNotice.user}发布的通知，${
              currentNotice.type === 0
                ? '这是一条Web后台通知，将只向设计师和管理员开放。'
                : '这是一条设计师通知，将只向您旗下的设计师开放。'
            }`}</span>
          </p>
          <Input
            placeholder="标题"
            value={editTitle}
            onChange={e => {
              dispatch({
                type: 'notice/save',
                payload: {
                  editTitle: e.target.value,
                },
              });
            }}
            style={{ marginBottom: '20px' }}
          ></Input>
          <TextArea
            autoSize={{
              minRows: 5,
            }}
            value={editContent}
            onChange={e => {
              dispatch({
                type: 'notice/save',
                payload: {
                  editContent: e.target.value,
                },
              });
            }}
          />
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <span className={styles.tip} style={{ margin: 'auto 12px' }}>
              {editIsTop > 0 ? '该条通知将被置顶' : '该条通知不会被置顶'}
            </span>
            <Switch
              checked={editIsTop > 0}
              onChange={check => {
                dispatch({
                  type: 'notice/save',
                  payload: {
                    editIsTop: check === false ? 0 : 1,
                  },
                });
              }}
            />
          </div>
        </Modal>
        {/* 通知详情对话框 包含对修改删除按钮的权限管控 */}
        <Modal
          zIndex={9900}
          visible={currentView}
          centered
          title={[
            <span>通知详情</span>,

            <span>
              {currentNotice.is_top > 0 ? (
                <span className={styles.tip} style={{ color: 'red', margin: 'auto 8px' }}>
                  <Icon type="fire" />
                  置顶通知
                </span>
              ) : (
                ''
              )}
            </span>,
          ]}
          loading={currentLoading}
          footer={[
            <div loading>
              <span className={styles.tip} style={{ margin: 'auto 10px' }}>
                {`${currentNotice.user} 发布于 
                ${currentNotice.create_at}
              `}
              </span>
              <Authorized authority={['admin', 'root']} noMatch={<div></div>}>
                <Button
                  onClick={() => {
                    dispatch({
                      type: 'notice/save',
                      payload: {
                        editView: true,
                        editTitle: currentNotice.title,
                        editContent: currentNotice.content,
                        editIsTop: currentNotice.is_top,
                        currentView: false,
                      },
                    });
                  }}
                >
                  修改
                </Button>
                <Popconfirm
                  zIndex={9950}
                  title="确定要删除这条通知吗？"
                  onConfirm={() => {
                    dispatch({
                      type: 'notice/save',
                      payload: {
                        deleteLoading: true,
                      },
                    });
                  }}
                >
                  <Button type="danger" loading={deleteLoading}>
                    删除
                  </Button>
                </Popconfirm>
              </Authorized>
            </div>,
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
          <p style={{ fontWeight: '500', fontSize: '24px' }}>{currentNotice.title}</p>
          {currentNotice.content}
        </Modal>
        {/* 搜索抽屉 */}
        <Drawer
          title="通知搜索"
          width={720}
          onClose={() => {
            dispatch({
              type: 'notice/save',
              payload: {
                searchDrawer: false,
              },
            });
          }}
          visible={searchDrawer}
        >
          <Search
            placeholder="搜索通知内容..."
            loading={searchLoading}
            value={searchWord}
            enterButton
            onChange={e => {
              dispatch({
                type: 'notice/save',
                payload: {
                  searchWord: e.target.value,
                },
              });
              if (count <= 200) {
                dispatch({
                  type: 'notice/search',
                });
              }
            }}
            onPressEnter={() => {
              dispatch({
                type: 'notice/search',
              });
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <span className={styles.tip}>
              {count > 200 ? '总通知条数过多，已关闭自动搜索' : '已开启自动搜索'}
            </span>
          </div>
          <Divider>搜索结果</Divider>
          <Spin spinning={searchLoading}>
            <div
              style={{
                width: '672px',
                minHeight: '300px',
                margin: 'auto',
              }}
            >
              <div>
                <div
                  className={styles.searchNotice}
                  onClick={() => {
                    dispatch({
                      type: 'notice/save',
                      payload: {
                        currentId: 0,
                        currentView: true,
                      },
                    });
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
