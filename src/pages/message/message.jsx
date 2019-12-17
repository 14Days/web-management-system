import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Avatar, Button, Comment, Drawer, Empty, Form, Icon, Input, Modal, Upload } from 'antd';
import { connect } from 'dva';
import { showNotification } from '../../utils/common';
import CardLine from './cardLine/cardLine';

import styles from './message.less';

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
    const model = this.state.visible.update === true ? 'update' : 'upload';
    // 先添加一个文件上传中的提示
    this.props.dispatch({
      type: 'message/loading',
      payload: { model },
    });
    const { file } = action;
    this.getBase64(file);
  };

  // 预览图片
  handlePreview = ({ url }) => {
    const img = new Image();
    img.src = url;
    const newWin = window.open('', '_blank');
    newWin.document.write(img.outerHTML);
    newWin.document.title = '预览图';
    newWin.document.close();
  };

  // 删除图片
  handleRemove = ({ uid }) => {
    const model = this.state.visible.update === true ? 'update' : 'upload';
    this.props.dispatch({
      type: 'message/delete',
      payload: {
        uid,
        model,
      },
    });
  };

  // Modal 取消按钮
  handleCancel = () => {
    console.log(this.props);
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
     * img 是 id 的数组
     */
    const { img: imgs } = this.props[model.toLowerCase()];
    const img = [];
    let isAllReady = true;
    imgs.forEach(item => {
      if (item.status === 'uploading') isAllReady = false;
      img.push(item.imgID);
    });
    if (!isAllReady) {
      showNotification('error', '请等待所有图片完成上传哦😬');
      return;
    }
    console.log(img);
    console.log(this.props);
    this.props.dispatch({
      type: `message/handle${model}Message`,
      payload: {
        content,
        img,
      },
    });
    console.log(this.props);
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
            onRemove={this.handleRemove}
            onPreview={this.handlePreview}
            onDownload={this.handlePreview}
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
            onRemove={this.handleRemove}
            onPreview={this.handlePreview}
            onDownload={this.handlePreview}
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
        <Button
          onClick={() => {
            console.log(this.state);
            console.log(this.props);
          }}
        >
          ok
        </Button>
        <div className={styles.container}>
          <CardLine
            side="left"
            openEditModal={() => {
              this.setState({
                visible: { update: true },
              });
            }}
          />
          <CardLine
            side="right"
            openEditModal={() => {
              this.setState({
                visible: { update: true },
              });
            }}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(connect(state => state.message)(Message));
