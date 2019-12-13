import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import {
  Avatar,
  Button,
  Carousel,
  Comment,
  Drawer,
  Empty,
  Form,
  Icon,
  Input,
  List,
  Modal,
  Upload,
  Tooltip,
} from 'antd';
import { showNotification } from '../../utils/common';
import './message.less';
import { pullImgURL } from '../../utils/url';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: {
        Upload: false,
        Update: false,
        Drawer: false,
      },
    };
    this.props.form.setFieldsValue({
      UpdateContent: '',
      UploadContent: '',
    });
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'message/handleInit',
    });
  }

  getBase64 = file => {
    const reader = new FileReader();
    const model = this.state.visible.update === true ? 'update' : 'upload';
    reader.readAsDataURL(file);
    // 将表单中的 avatar 设置为 reader 后的 database64，显示在页面上.
    reader.onload = () => {
      this.props.dispatch({
        type: 'message/handleUpload',
        payload: {
          file,
          url: reader.result,
          model,
        },
      });
    };
  };

  // 抽屉弹出和弹入
  triggerDrawer = () => {
    const { visible } = this.state;
    this.setState({
      visible: {
        ...visible,
        Drawer: !visible.Drawer,
      },
    });
  };

  // 上传图片
  handleUpload = action => {
    const { file } = action;
    this.getBase64(file);
  };

  // 上传组件变化时触发
  handleChange = ({ fileList }) => {
    const model = this.state.visible.update === true ? 'update' : 'upload';
    if (this.props[model].img.length > fileList.length) {
      const origin = this.props[model];
      this.props.dispatch({
        type: 'message/save',
        payload: {
          [model]: {
            ...origin,
            img: fileList,
          },
        },
      });
    }
  };

  // Modal 取消按钮
  handleCancel = () => {
    // 标记打开了哪一个对话框
    const model = this.state.visible.update === true ? 'Update' : 'Upload';
    this.setState({
      visible: {
        [model]: false,
      },
    });
  };

  // Modal 确定按钮
  handleOk = () => {
    // 标记打开了哪一个对话框
    const model = this.state.visible.update === true ? 'Update' : 'Upload';

    // 检查上传的推荐消息是否填写U
    const FieldsValue = this.props.form.getFieldsValue();
    const content = FieldsValue[`${model}Content`];
    if (content === '') {
      showNotification('error', '没有写推荐内容哦😯');
      return;
    }
    if (this.props[model.toLowerCase()].img.length === 0) {
      showNotification('error', '没有上传图片哦😯');
      return;
    }

    /**
     * 发送请求
     * img 是 id
     */
    const { img: imgs } = this.props[model.toLowerCase()];
    const img = [];
    imgs.forEach(item => {
      img.push(item.imgID);
    });
    this.props.dispatch({
      type: `message/handle${model}Message`,
      payload: {
        content,
        img,
      },
    });

    // 隐藏弹出框
    this.setState({ visible: { [model]: false } });

    // 上传成功后要把 state 清空
    this.props.form.resetFields();
  };

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
              new Promise(resolve => {
                this.props.dispatch({
                  type: 'message/handleInit',
                });
                resolve();
              }).then(() => {
                showNotification('success', '刷新成功');
              });
            }}
          >
            刷新
          </Button>,
          <Button
            type="primary"
            onClick={() => {
              this.setState({ visible: { upload: true } });
            }}
            style={{ marginLeft: '20px' }}
          >
            发布推荐消息
          </Button>,
        ]}
      >
        <Modal
          title="发布推荐消息"
          visible={this.state.visible.upload}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form.Item label="推荐内容(按住右下角下拉可扩大文本输入框)">
            {getFieldDecorator('UploadContent', {
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
        <Modal
          title="修改推荐消息"
          visible={this.state.visible.update}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form.Item label="推荐内容(按住右下角下拉可扩大文本输入框)">
            {getFieldDecorator('UpdateContent', {
              rules: [
                {
                  required: true,
                  message: '推荐内容不能为空',
                },
              ],
              initialValue: '',
            })(<Input.TextArea placeholder="请在这里输入推荐内容" />)}
          </Form.Item>
          {/* 上传图片 */}
          <Upload
            accept=".png,.jpg,.jpeg"
            customRequest={this.handleUpload}
            method="post"
            listType="picture-card"
            fileList={this.props.update.img}
            onChange={this.handleChange}
          >
            {uploadButton}
          </Upload>
        </Modal>
        {/* 抽屉显示评论 */}
        <Drawer
          title="一级评论详情"
          placement="bottom"
          closable={false}
          height={600}
          onClose={this.triggerDrawer}
          visible={this.state.visible.Drawer}
          keyboard
        >
          {/*
            comment: [{
              content,
              create_at,
              id,
              second:[]
              user:{
                avatar,
                id,
                nickname
              }
            }]
            TODO: 完成评论发表时间，下拉滚动，或者说页面跳转
          */}
          {this.props.detail.comment.length === 0 ? (
            <Empty />
          ) : (
            this.props.detail.comment.map(item => (
              <Comment
                actions={[<a color="red">删除</a>]}
                author={item.user.nickname}
                avatar={<Avatar src={item.user.avatar} />}
                content={<p>{item.content}</p>}
              >
                {item.second.map(ele => (
                  <Comment
                    actions={[<a color="red">删除</a>]}
                    author={ele.user.nickname}
                    avatar={<Avatar src={ele.user.avatar} />}
                    content={<p>{ele.content}</p>}
                  />
                ))}
              </Comment>
            ))
          )}
        </Drawer>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={this.props.message}
          pagination={{
            pageSize: 5,
          }}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Tooltip title={this.props.detail.thumbInfo}>
                  {/* TODO 提示每次都要重新拉数据 */}
                  <div>点赞数：{item.thumb}</div>
                </Tooltip>,
                <div
                  onClick={() => {
                    new Promise(resolve => {
                      this.props.dispatch({
                        type: 'message/getDetail',
                        payload: item.id,
                      });
                      resolve();
                    }).then(() => {
                      this.triggerDrawer();
                      console.log(this.props);
                    });
                  }}
                >
                  评论数：{item.comment}
                </div>,
                <Button
                  type="primary"
                  onClick={() => {
                    this.props.dispatch({
                      type: 'message/updateMessagePrepare',
                      payload: {
                        index,
                      },
                    });
                    // const UpdateContent = this.props.update.content;
                    this.setState({
                      visible: { update: true },
                    });
                  }}
                  style={{ marginLeft: '20px' }}
                >
                  修改
                </Button>,
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
                  {/* TODO 删除时要有提示 */}
                  删除
                </Button>,
              ]}
              extra={
                <div>
                  <Carousel autoplay style={{ width: '450px' }}>
                    {item.img_url.map(ele => (
                      <img
                        src={`${pullImgURL}${ele.name}`}
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
