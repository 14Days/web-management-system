import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Button, Carousel, List, Spin } from 'antd';

import './message.less';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'message/handleInit',
    });
  }

  render() {
    return (
      <PageHeaderWrapper
        content={[
          // 最后更新时间行
          <Button
            type="dashed"
            onClick={() => {
              this.props.dispatch({
                type: 'message/handleInit',
              });
            }}
          >
            刷新
          </Button>,
        ]}
      >
        <Spin spinning={this.props.loading}>
          <List
            itemLayout="vertical"
            size="large"
            dataSource={this.props.message}
            pagination={{
              pageSize: 5,
            }}
            footer={<div> i am footer!!!</div>}
            renderItem={(item, index) => (
              <List.Item
                key="123"
                actions={[
                  <Button
                    type="danger"
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
                  </Button>,
                ]}
                extra={
                  <div>
                    <Carousel autoplay style={{ width: '450px' }}>
                      {item.img_url.map(url => (
                        <img src={url} alt={url} />
                      ))}
                    </Carousel>
                  </div>
                }
              >
                <List.Item.Meta title={item.id} />
                {item.content}
              </List.Item>
            )}
          />
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default connect(state => state.message)(Message);
