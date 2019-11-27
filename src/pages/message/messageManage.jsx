import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Button, Carousel, Form, Icon, Input, List, Modal, Upload } from 'antd';
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

  getBase64 = file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // 将表单中的 avatar 设置为 reader 后的 database64，显示在页面上.
    reader.onload = () => {
      this.props.dispatch({
        type: 'message/handleUpload',
        payload: {
          file,
          url: reader.result,
        },
      });
    };
  };

  // Modal 取消按钮
  handleCancel = () => {
    console.log(this.props);
    this.setState({ visible: false });
  };

  // 上传图片
  handleUpload = action => {
    console.log('action', action);
    const { file } = action;
    this.getBase64(file);
  };

  // 上传组件变化时触发
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

  // Modal 确定按钮
  handleOk() {
    // 检查上传的推荐消息是否填写
    const { content } = this.props.form.getFieldsValue();
    if (content === '') {
      showNotification('error', '没有写推荐内容哦😯');
      return;
    }
    if (this.props.upload.img.length === 0) {
      showNotification('error', '没有上传图片哦😯');
      return;
    }

    // 发送上传请求
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
            accept=".png,.jpg,.jpeg"
            customRequest={this.handleUpload}
            method="post"
            listType="picture-card"
            fileList={this.props.upload.img}
            onChange={this.handleChange}
          >
            {uploadButton}
          </Upload>
        </Modal>
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
              actions={[
                <div>点赞数：{item.thumb}</div>,
                <div>评论数：{item.comment}</div>,
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
                    {item.img_url.map(ele => (
                      <img
                        src={`http://pull.wghtstudio.cn/img/${ele.name}`}
                        alt={ele.name}
                        width={300}
                        height={300}
                      />
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
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(connect(state => state.message)(Message));
