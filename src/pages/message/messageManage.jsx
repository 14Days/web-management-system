import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Button, Tooltip, List, Spin, Card } from 'antd';

import styles from './message.less';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    console.log('componentWillMount');
    this.props.dispatch({
      type: 'message/handleInit',
    });
  }

  render() {
    return (
      <React.Fragment>
        {/* 大图查看器 */}
        <div
          className={styles.bigPhoto}
          onClick={() => {
            this.props.dispatch({
              type: 'message/save',
              payload: {
                currentURL: '',
              },
            })
          }}
          style={{ display: this.props.currentURL === '' ? 'none' : 'flex' }}
          id="bigPhotos"
        >
          <img
            src={this.props.currentURL} alt={this.props.currentURL}
            style={{ margin: 'auto' }}
          />
        </div>
        {/* 页面部分 */}
        <PageHeaderWrapper>
          <Spin spinning={this.props.loading}>
            <Card>
              <List
                itemLayout="vertical"
                size="large"
                dataSource={this.props.message}
                pagination={{
                  pageSize: 5,
                }}
                renderItem={(item, index) => (
                  <List.Item
                    key="123"
                    extra={
                      <div>
                        <div style={{ width: '490px', display: 'flex', justifyContent: 'left' }}>
                          {item.img_url.map(url => (
                            <Tooltip
                              title="查看大图"
                              onClick={() => {
                                this.props.dispatch({
                                  type: 'message/save',
                                  payload: {
                                    currentURL: url,
                                  },
                                })
                              }}
                            >
                              <img
                                src={url} alt={url}
                                style={{ width: '90px', height: '90px', objectFit: 'cover', margin: '10px' }}
                              />
                            </Tooltip>
                          ))}
                        </div>
                        <div>
                          <Button
                            type="danger"
                            style={{
                              position: 'reletive',
                              bottom: '-50px',
                            }}
                            onClick={() => {
                              this.props.dispatch({
                                type: 'message/handleDelete',
                                payload: {
                                  id: item.id,
                                  index,
                                },
                              });
                            }}
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                    }
                  >
                    <List.Item.Meta title={item.id} />
                    {item.content}
                  </List.Item>
                )}
              />
            </Card>
          </Spin>
        </PageHeaderWrapper>
      </React.Fragment>
    );
  }
}

export default connect(state => state.message)(Message);
