import { Input, Divider, Drawer, Spin, Tooltip } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './style.less';

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
      </Drawer>
    );
  }
}

export default SearchDrawer;
