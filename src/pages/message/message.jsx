import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { BackTop, Button, Form, Icon, Input, Modal, Upload } from 'antd';
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

  getBase64 = (file, uid) => {
    const reader = new FileReader();
    const model = this.state.visible.update === true ? 'update' : 'upload';
    reader.readAsDataURL(file);
    // 将表单中的 avatar 设置为 reader 后的 database64，显示在页面上.
    reader.onload = () => {
      console.log('uid', uid);
      this.props.dispatch({
        type: 'message/handleUpload',
        payload: {
          file,
          url: reader.result,
          model,
          uid,
        },
      });
    };
  };

  // 上传图片
  handleUpload = action => {
    const model = this.state.visible.update === true ? 'update' : 'upload';
    const uid = this.props[model].inc;
    // 先添加一个文件上传中的提示
    this.props.dispatch({
      type: 'message/loading',
      payload: { model },
    });
    const { file } = action;
    this.getBase64(file, uid);
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
    if (!content) {
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
      if (item.status === 'done') img.push(item.imgID);
    });
    if (!isAllReady) {
      showNotification('error', '请等待所有图片完成上传哦😬');
      return;
    }
    if (img.length !== imgs.length) {
      showNotification('warn', '上传失败但是未删除的图片将会被忽略哦');
    }
    if (img.length === 0) {
      showNotification('error', '没有上传成功的图片哦😯');
      return;
    }
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
        <BackTop className={styles.backTop}>
          <Icon type="up-circle" />
          <span> 回到顶部</span>
        </BackTop>
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
          <Button
            onClick={() => {
              console.log(this.props);
            }}
          >
            p
          </Button>
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
        <Button
          className={styles.loadMore}
          onClick={() => {
            this.props.dispatch({
              type: 'message/handleLoadMore',
            });
          }}
          disabled={this.props.loadAll}
          type="dashed"
        >
          {this.props.loadAll ? '没咯！！' : <Icon type="caret-down" />}
        </Button>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(connect(state => state.message)(Message));
