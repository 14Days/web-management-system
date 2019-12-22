import {
  Input,
  Divider,
  Drawer,
  Spin,
  Tooltip,
  Icon,
  Button,
  Popconfirm,
  Modal,
  Switch
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './style.less';
import Authorized from '@/utils/Authorized';

@connect(({ notice }) => ({
  notice,
}))
class SearchDrawer extends Component {
  render() {
    const { Search } = Input;
    const { notice, dispatch } = this.props;
    const {
      searchCount,
      searchPage,
      searchLoading,
      searchWord,
      count,
      searchRes,
      searchResWord,
      searchDrawer,
      searchPageLoading,
      searchCurrentView,
      currentNotice,
      currentLoading,
      deleteLoading,
      searchEditView,
      editTitle,
      editLoading,
      editContent,
      editIsTop
    } = notice;
    let moreTip = '';
    if (searchResWord === '') {
      moreTip = '';
    } else if (searchPageLoading) {
      moreTip = '加载中';
    } else if ((searchPage + 1) * 8 < searchCount) {
      moreTip = '点击加载更多...';
    } else if (searchRes.length === 0) {
      moreTip = '暂无结果哦😜~';
    } else {
      moreTip = '已全部加载😜~';
    }
    const { TextArea } = Input;
    let tipWord = '';
    switch (currentNotice.type) {
      case 1:
        tipWord = '这是一条管理员通知，将只管理员开放。';
        break;
      case 2:
        tipWord = '这是一条设计师通知，将只向您旗下的设计师开放。';
        break;
      case 3:
        tipWord = '这是一条用户通知，将只向App端的用户开放。';
        break;
      default:
        break;
    }
    const selfID = parseInt(sessionStorage.getItem('userID'), 10);
    return (
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
          placeholder="搜索通知标题..."
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
                type: 'notice/fastSearch',
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
              margin: 'auto',
            }}
          >
            {searchRes.map(item => (
              <Tooltip title="查看完整通知">
                <div
                  className={styles.searchNotice}
                  onClick={() => {
                    dispatch({
                      type: 'notice/fetchInfo',
                      payload: {
                        currentId: item.id,
                        search: true,
                      },
                    });
                  }}
                >
                  <div className={styles.noticeTitle}>
                    <p>{item.title}</p>
                  </div>
                  <div className={styles.noticeContent}>
                    <p>{item.content}</p>
                  </div>
                  <div className={styles.noticeTime}>
                    <p>{item.user_type === 1 ? '由超级管理员发布的通知' : '由管理员发布的通知'}</p>
                    <p>{`${item.user} 发布于 ${item.create_at}`}</p>
                  </div>
                </div>
              </Tooltip>
            ))}
          </div>
          <div
            className={styles.moreTip}
            onClick={() => {
              dispatch({
                type: 'notice/searchNextPage',
              });
            }}
          >
            <p className={styles.tip}>{moreTip}</p>
          </div>
        </Spin>
        <Drawer
          visible={searchCurrentView}
          title={[
            <span>通知详情</span>,
            <span>
            {currentNotice.is_top > 0 ? (
              <span className={styles.tip} style={{ color: 'red', margin: 'auto 16px' }}>
                <Icon type="caret-up" />
                置顶通知
              </span>
            ) : (
              ''
            )}
          </span>,
          ]}
          width={800}
          onClose={() => {
            dispatch({
              type: 'notice/save',
              payload: {
                searchCurrentView: false,
              },
            });
          }}
        >
          <p style={{ fontWeight: '600', fontSize: '20px' }}>
            {currentNotice.title}
            <span className={styles.tip} style={{ margin: 'auto 10px' }}>
              {`${currentNotice.user} 发布于 
                ${currentNotice.create_at}
              `}
            </span>
            <Authorized authority={['root']} noMatch={null}>
              <Button
                style={{ marginRight: '8px' }}
                onClick={() => {
                  dispatch({
                    type: 'notice/save',
                    payload: {
                      searchEditView: true,
                      editTitle: currentNotice.title,
                      editContent: currentNotice.content,
                      editIsTop: currentNotice.is_top,
                    },
                  });
                }}
              >
                修改
              </Button>
              <Popconfirm
                placement="bottom"
                zIndex={9950}
                title="确定要删除这条通知吗？"
                onConfirm={() => {
                  dispatch({
                    type: 'notice/handleDelete',
                    payload: {
                      search: true,
                    },
                  });
                }}
              >
                <Button type="danger" loading={deleteLoading}>
                  删除
                </Button>
              </Popconfirm>
            </Authorized>
            <Authorized authority={['admin']} noMatch={null}>
              {currentNotice.user_id === selfID ? (
                <React.Fragment>
                  <Button
                    style={{ marginRight: '8px' }}
                    onClick={() => {
                      dispatch({
                        type: 'notice/save',
                        payload: {
                          searchEditView: true,
                          editTitle: currentNotice.title,
                          editContent: currentNotice.content,
                          editIsTop: currentNotice.is_top,
                        },
                      });
                    }}
                  >
                    修改
                  </Button>
                  <Popconfirm
                    placement="bottom"
                    zIndex={9950}
                    title="确定要删除这条通知吗？"
                    onConfirm={() => {
                      dispatch({
                        type: 'notice/handleDelete',
                        payload: {
                          search: true,
                        },
                      });
                    }}
                  >
                    <Button type="danger" loading={deleteLoading}>
                      删除
                    </Button>
                  </Popconfirm>
                </React.Fragment>
              ) : null}
            </Authorized>
          </p>
          <div>{currentNotice.content}</div>
          <Drawer
            title="修改通知"
            width={800}
            visible={searchEditView}
            onClose={() => {
              dispatch({
                type: 'notice/save',
                payload: {
                  searchEditView: false,
                  editTitle: '',
                  editContent: '',
                },
              });
            }}
          >
            <p>
          <span
            className={styles.tip}
          >{`正在修改${currentNotice.user}发布的通知，${tipWord}`}</span>
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
            />
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
            <div style={{ textAlign: 'right', marginTop: '30px' }}>
              <Button
                type="primary"
                loading={editLoading}
                onClick={() => {
                  dispatch({
                    type: 'notice/handleChange',
                    payload: {
                      search: true,
                    },
                  })
                }}
              >保存</Button>
            </div>
          </Drawer>
        </Drawer>
      </Drawer>
    );
  }
}

export default SearchDrawer;
