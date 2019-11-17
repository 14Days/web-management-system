import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Button, Carousel, Form, Icon, Input, List, Modal, Spin, Upload } from 'antd';
import { showNotification } from '../../utils/common';
import './message.less';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'message/handleInit',
    });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleUpload = action => {
    const { file } = action;
    this.props.dispatch({
      type: 'message/handleUpload',
      payload: {
        file,
      },
    });
  };

  handleChange = ({ fileList }) => {
    if (this.props.upload.img.length > fileList.length) {
      this.props.dispatch({
        type: 'message/save',
        payload: {
          upload: {
            img: fileList,
          },
        },
      });
    }
  };

  handleOk() {
    // 检查上传的推荐消息是否填写
    if (this.props.upload.img.length === 0) {
      showNotification('error', '没有上传图片哦😯');
      return;
    }
    // 发送上传请求
    const { content } = this.props.form.getFieldsValue();
    const { img: imgs } = this.props.upload;
    const img = [];
    const url = [];
    imgs.forEach(item => {
      img.push(item.imgID);
      url.push(item.url);
    });
    this.props.dispatch({
      type: 'message/handleUploadMessage',
      payload: {
        content,
        img,
        url,
      },
    });
    // 隐藏弹出框
    this.setState({ visible: false });

    // 上传成功后要把 state 清空
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

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
          <Button
            type="primary"
            onClick={() => {
              this.setState({ visible: true });
            }}
            style={{ marginLeft: '20px' }}
          >
            发布推荐消息
          </Button>,
        ]}
      >
        {/* 弹出的推荐消息上传窗口 */}
        <Spin spinning={this.props.loading.upload}>
          <Modal
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Form.Item label="推荐内容(按住右下角下拉可扩大文本输入框)">
              {getFieldDecorator('content', {
                rules: [
                  {
                    required: true,
                    message: '推荐内容不能为空',
                  },
                ],
              })(<Input.TextArea placeholder="请在这里输入推荐内容" />)}
            </Form.Item>
            {/* 上传图片 */}
            <Upload
              customRequest={this.handleUpload}
              method="post"
              listType="picture-card"
              fileList={this.props.upload.img}
              onChange={this.handleChange}
            >
              {uploadButton}
            </Upload>
          </Modal>
        </Spin>
        <Spin spinning={this.props.loading.page}>
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
                        <img src={url} alt={url} width={300} height={300} />
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

export default Form.create()(connect(state => state.message)(Message));
