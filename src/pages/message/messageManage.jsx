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
    console.log('componentWillMount');
    this.props.dispatch({
      type: 'message/handleInit',
    });
  }

  render() {
    return (
      <PageHeaderWrapper>
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
                extra={
                  <div>
                    <Carousel autoplay style={{ width: '450px' }}>
                      {item.img_url.map(url => (
                        <img src={url} alt={url} />
                      ))}
                    </Carousel>
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
