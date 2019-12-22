import {
  Affix,
  Card,
  Col,
  Descriptions,
  Divider,
  Icon,
  Input,
  Modal,
  Row,
  Select,
  Tooltip,
  Upload,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

import styles from './style.less';

@connect(({ gallery }) => ({
  gallery,
}))
class Notice extends Component {
  state = {};

  componentWillMount() {
    const { dispatch } = this.props;
    // 图库全刷新：一次刷新图集 + 图片
    dispatch({
      type: 'gallery/allRefresh',
    });
  }

  render() {
    const { gallery, dispatch } = this.props;
    const {
      last,
      files,
      imgs,
      count,
      page,
      newFile,
      newFileName,
      imgLoading,
      nowFile,
      editFile,
      editFileState,
      toDeleteFile,
      toDeleteFileState,
      selected,
      toMoveImgState,
      toMoveImg,
      toMoveImgDist,
      toDeleteImg,
      toDeleteImgState,
      toPostImg,
      toPostImgState,
      uploadState,
      uploadImg,
      fileHover,
      bigImg,
      bigImgState,
    } = gallery;
    const { Option } = Select;
    const { TextArea } = Input;
    // 激活新建图集时显示的框架
    const dealNewFile = (
      <div>
        {/* 输入框 */}
        <Input
          style={{ width: '80%' }}
          defaultValue={newFileName}
          autoFocus
          onChange={e => {
            dispatch({
              type: 'gallery/save',
              payload: {
                newFileName: e.target.value,
              },
            })
          }}
          onPressEnter={() => {
            dispatch({
              type: 'gallery/dealNewFile',
            })
          }}
          onClick={e => {
            e.stopPropagation();
          }}
        />
        {/* 冗余的确认键 */}
        <Icon
          type="check"
          style={{
            margin: 'auto 2%',
            color: 'white',
            fontSize: '20px',
          }}
          onClick={e => {
            e.stopPropagation();
            dispatch({
              type: 'gallery/dealNewFile',
            });
          }}
        />
      </div>
    );
    const reallyWidth = document.body.clientWidth;
    let colNum = 4;
    if (reallyWidth < 743) {
      colNum = 2;
    } else if (reallyWidth < 1185) {
      colNum = 3;
    }
    return (
      <PageHeaderWrapper
        title="图库"
        subTitle="存储并管理您的珍贵图片素材"
        content={[
          // 最后更新时间行
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="最后刷新时间">
              {last}
              <Tooltip
                title="刷新图片"
                onClick={() => {
                  dispatch({
                    type: 'gallery/imgRefresh',
                    payload: {
                      fileId: -1,
                    },
                  });
                }}
              >
                <Icon type="sync" spin={imgLoading} style={{ margin: 'auto 10px' }}/>
              </Tooltip>
            </Descriptions.Item>
          </Descriptions>,
        ]}
      >
        {/* 更改图集名称浮框 */}
        <Modal
          title="更改图集名称"
          visible={editFileState}
          onOk={() => {
            dispatch({
              type: 'gallery/dealRenameFile',
            })
          }}
          onCancel={() => {
            dispatch({
              type: 'gallery/save',
              payload: {
                editFileState: false,
              },
            })
          }}
        >
          <Input
            value={editFile.name}
            onChange={e => {
              dispatch({
                type: 'gallery/saveFileName',
                payload: {
                  name: e.target.value,
                },
              })
            }}
          />
        </Modal>
        {/* 删除图集浮框 */}
        <Modal
          title="删除图集"
          visible={toDeleteFileState}
          onOk={() => {
            dispatch({
              type: 'gallery/dealDeleteFile',
            })
          }}
          onCancel={() => {
            dispatch({
              type: 'gallery/save',
              payload: {
                toDeleteFileState: false,
              },
            })
          }}
        >
          <p style={{ color: 'red' }}>删除后，图集里的图片不会被删除，但将回到未归档状态，请谨慎操作。</p>
          <p>确定要删除 <span style={{ fontWeight: '700' }}>{toDeleteFile.name}</span> 图集吗？</p>
        </Modal>
        {/* 移动图片浮框 */}
        <Modal
          width="70%"
          title="移动图片"
          visible={toMoveImgState}
          onCancel={() => {
            dispatch({
              type: 'gallery/save',
              payload: {
                toMoveImgState: false,
              },
            })
          }}
          okButtonProps={{
            disabled: toMoveImgDist === 0,
          }}
          destroyOnClose
          onOk={() => {
            dispatch({
              type: 'gallery/dealMoveImg',
            })
          }}
        >
          <div className={styles.moveModal}>
            {/* 图片显示 */}
            <div className={styles.showImg}>
              {
                toMoveImg.img_id === 0 ? <div/> :
                  <img
                    src={`http://pull.wghtstudio.cn/img/${toMoveImg.name}`}
                    alt=""
                  />
              }
            </div>
            {/* 图集选择 */}
            <div style={{ marginTop: '50px' }}>
              <p>
                <span style={{ margin: 'auto 20px' }}>移动到</span>
                <Select
                  placeholder="选择一个图集..."
                  style={{ width: 300 }}
                  onChange={value => {
                    dispatch({
                      type: 'gallery/save',
                      payload: {
                        toMoveImgDist: value,
                      },
                    })
                  }}
                >
                  {
                    files.map(item => <Option
                      value={item.id}
                      disabled={item.id === 0 || item.id === toMoveImg.file_id}
                    >
                      {item.name}
                    </Option>)
                  }
                </Select>
              </p>
            </div>
          </div>
        </Modal>
        {/* 删除图片浮框 */}
        <Modal
          width="70%"
          title="删除图片"
          visible={toDeleteImgState}
          onCancel={() => {
            dispatch({
              type: 'gallery/save',
              payload: {
                toDeleteImgState: false,
              },
            });
          }}
          onOk={() => {
            dispatch({
              type: 'gallery/dealDeleteImg',
            })
          }}
        >
          <div className={styles.moveModal}>
            {/* 图片显示 */}
            <div className={styles.showImg}>
              {
                toDeleteImg.img_id === 0 ? <div/> :
                  <img
                    src={`http://pull.wghtstudio.cn/img/${toDeleteImg.name}`}
                    alt=""
                  />
              }
            </div>
            <div style={{ marginTop: '50px' }}>
              <p style={{ color: 'red' }}>删除后，图片将永久无法被找回！请谨慎操作。</p>
              <p>确定要删除这张图片吗？</p>
            </div>
          </div>
        </Modal>
        {/* 查看大图浮框 */}
        <Modal
          width="70%"
          title="查看大图"
          visible={bigImgState}
          onCancel={() => {
            dispatch({
              type: 'gallery/save',
              payload: {
                bigImgState: false,
              },
            });
          }}
          footer={null}
        >
          <div className={styles.moveModal}>
            {/* 图片显示 */}
            <div className={styles.showImg}>
              <img
                src={`http://pull.wghtstudio.cn/img/${bigImg}`}
                alt=""
              />
            </div>
            <div style={{ marginTop: '30px' }}>
                <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                  <Icon type="exclamation-circle" style={{ margin: 'auto 6px' }}/>
                  右击图片，选择 [图片另存为...] 即可保存图片到本地。
                </p>
            </div>
          </div>
        </Modal>
        {/* 推荐消息发布浮框 */}
        <Modal
          width="800px"
          title="发布推荐消息"
          visible={toPostImgState}
          onCancel={() => {
            dispatch({
              type: 'gallery/save',
              payload: {
                toPostImgState: false,
              },
            });
          }}
          onOk={() => {
            dispatch({
              type: 'gallery/dealPostImg',
            });
          }}
          destroyOnClose
          okButtonProps={{
            disabled: toPostImg === '',
          }}
        >
          <div className={styles.sendModal}>
            {/* 提示信息 */}
            <div>
              <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                <Icon type="exclamation-circle" style={{ margin: 'auto 6px' }}/>
                消息发布后 APP 用户将看到您的推荐消息，您可以在 [推荐消息管理页] 管理已经发布的推荐消息。
              </p>
            </div>
            {/* 内容输入框 */}
            <p>
              <TextArea
                style={{ width: '734px' }}
                placeholder="介绍一下想要推荐的内容吧"
                autoSize={{ maxRows: 5 }}
                onChange={e => {
                  dispatch({
                    type: 'gallery/save',
                    payload: {
                      toPostImg: e.target.value,
                    },
                  })
                }}
              />
            </p>
            {/* 图片显示 */}
            <div className={styles.imgSelected}>
              {
                selected.map(item => (
                    <img
                      src={`http://pull.wghtstudio.cn/img/${item.name}`}
                      alt="图片未能正常显示"
                    />
                  ),
                )
              }
            </div>
          </div>
        </Modal>
        {/* 上传图片浮框 */}
        <Modal
          title="上传图片"
          centered
          visible={uploadState}
          onCancel={() => {
            dispatch({
              type: 'gallery/save',
              payload: {
                uploadState: false,
              },
            });
          }}
          footer={null}
        >
          {/* 提示信息 */}
          <div>
            <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
              图片选择后将被自动上传，新上传的图片默认存储在 [未归档] 图集中。
            </p>
          </div>
          {/* 上传图框 */}
          <div className={styles.uploadBox}>
            <div>
              <Upload
                accept=".png,.jpg,.jpeg"
                customRequest={action => {
                  const { file } = action;
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => {
                    dispatch({
                      type: 'gallery/handleUpload',
                      payload: {
                        file,
                        url: reader.result,
                      },
                    });
                  };
                }}
                method="post"
                listType="picture-card"
                fileList={uploadImg}
                onChange={({ fileList }) => {
                  if (uploadImg.length > fileList.length) {
                    dispatch({
                      type: 'gallery/save',
                      payload: {
                        uploadImg: fileList,
                      },
                    });
                  }
                }}
              >
                <div>
                  <Icon type="plus"/>
                  <div className="ant-upload-text">开始上传</div>
                </div>
              </Upload>
            </div>
          </div>
        </Modal>
        {/* 浮动操作框 */}
        <div
          className={styles.floatBar}
          style={selected.length === 0 ? { width: '240px' } : {
            opacity: 1,
            width: '360px',
          }}
        >
          {selected.length === 0 ?
            // 未选择任何图片时
            <div>
              <p style={{
                color: 'rgba(0, 0, 0, 0.45)',
                fontSize: '16px',
              }}>点击图片即可选中哦~😜</p>
            </div>
            :
            // 有图片选中后
            <div>
              <p>
                <span
                  onClick={e => {
                    e.stopPropagation();
                    dispatch({
                      type: 'gallery/save',
                      payload: {
                        toPostImg: '',
                        toPostImgState: true,
                      },
                    });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                发布推荐动态
                </span>
                <span
                  style={{
                    color: 'rgba(0, 0, 0, 0.45)',
                    fontSize: '16px',
                    margin: 'auto 10px',
                  }}>
                  <span>{` 已选择 ${selected.length} 张图片 | `}</span>
                  <span
                    onClick={e => {
                      e.stopPropagation();
                      dispatch({
                        type: 'gallery/cleanSelected',
                      });
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    清空
                  </span>
                </span>
              </p>
            </div>
          }
        </div>
        {/* 浮动上传按钮 */}
        <div className={styles.floatUpload}>
          <p>
            <Icon
              type="cloud-upload"
              onClick={e => {
                e.stopPropagation();
                dispatch({
                  type: 'gallery/save',
                  payload: {
                    uploadState: true,
                  },
                })
              }}
            />
          </p>
        </div>
        {/* 图集栏 */}
        <div className={styles.file}>
          <Affix offsetTop={64}>
            <div
              className={styles.fileGroup}
              onMouseEnter={() => dispatch({
                type: 'gallery/save',
                payload: { fileHover: true },
              })}
              onMouseLeave={() => dispatch({
                type: 'gallery/save',
                payload: { fileHover: false },
              })}
              style={
                fileHover ? { height: 110 * (Math.ceil((files.length + 1) / colNum)) + 90 }
                  : { height: 160 }
              }
            >
              <Row gutter={[14, 10]} align="top">
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                  <Divider>图集</Divider>
                </Col>
                {/* 当前图集 */}
                <Col xl={6} lg={8} md={8} sm={12} xs={12}>
                  <div className={styles.fileBlock}>
                    {/* 背景 */}
                    <div className={styles.fileBlockContent}>
                      {
                        imgs.length > 0 ?
                          <img
                            className={styles.fileImg}
                            src={`http://pull.wghtstudio.cn/img/${imgs[0].name}`}
                            alt=""
                          /> : <img
                            className={styles.fileImg}
                            src="https://s2.ax1x.com/2019/12/19/QqoleU.png"
                            alt=""
                          />
                      }
                    </div>
                    {/* 显示 */}
                    <div className={styles.fileBlockAfter}>
                      <p>{nowFile.name}{nowFile.id === 0 ? <div/> :
                        <Icon
                          type="edit"
                          style={{
                            color: 'rgba(255, 255, 255, 0.4)',
                            fontSize: '16px',
                            margin: '8px 2%',
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            dispatch({
                              type: 'gallery/save',
                              payload: {
                                editFile: nowFile,
                                editFileState: true,
                              },
                            })
                          }}
                        />}</p>
                    </div>
                  </div>
                </Col>
                {/* 新建图集占位 */}
                <Col xl={6} lg={8} md={8} sm={12} xs={12}>
                  <div
                    className={styles.fileNotNow}
                    onClick={() => {
                      dispatch({
                        type: 'gallery/changeNewFile',
                      })
                    }}
                  >
                    <div className={styles.fileBlockContent}>
                      <img
                        className={styles.fileImg}
                        src="https://s2.ax1x.com/2019/12/19/QqoleU.png"
                        alt=""
                      />
                      {/* https://s2.ax1x.com/2019/12/19/QqWayF.jpg */}
                    </div>
                    <div className={styles.fileBlockAfter}>
                      {newFile ? dealNewFile : <p><Icon type="plus"/> 新建图集</p>}
                    </div>
                  </div>
                </Col>
                {/* 非当前图集 */}
                {files.map(item => (item.id === nowFile.id ? null : (
                  <Col xl={6} lg={8} md={8} sm={12} xs={12}>
                    <div
                      className={styles.fileNotNow}
                      onClick={() => {
                        dispatch({
                          type: 'gallery/save',
                          payload: {
                            nowFile: item,
                          },
                        });
                        dispatch({
                          type: 'gallery/imgRefresh',
                        });
                      }}
                    >
                      <div className={styles.fileBlockContent}>
                        {
                          item.imgsName === undefined ?
                            <img
                              className={styles.fileImg}
                              src="https://s2.ax1x.com/2019/12/19/QqoleU.png"
                              alt=""
                            /> : <img
                              className={styles.fileImg}
                              src={`http://pull.wghtstudio.cn/img/${item.imgsName}`}
                              alt=""
                            />
                        }
                      </div>
                      <div className={styles.fileBlockAfter}>
                        <p>{item.name}{item.id === 0 ? <div/> : <span>
                          <Icon
                            type="edit"
                            style={{
                              color: 'rgba(255, 255, 255, 0.4)',
                              fontSize: '16px',
                              margin: '8px 2%',
                            }}
                            onClick={e => {
                              e.stopPropagation();
                              dispatch({
                                type: 'gallery/save',
                                payload: {
                                  editFile: item,
                                  editFileState: true,
                                },
                              })
                            }}
                          />
                          <Icon
                            type="close"
                            style={{
                              color: 'rgba(255, 255, 255, 0.4)',
                              fontSize: '16px',
                              margin: '8px 2%',
                            }}
                            onClick={e => {
                              e.stopPropagation();
                              dispatch({
                                type: 'gallery/save',
                                payload: {
                                  toDeleteFile: item,
                                  toDeleteFileState: true,
                                },
                              });
                            }}
                          />
                              </span>}</p>
                      </div>
                    </div>
                  </Col>
                )))
                }
              </Row>
            </div>
          </Affix>
        </div>
        <Row className={styles.imgGroup} gutter={[0, 0]} align="top">
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Divider
              orientation="left"
              style={{
                color: 'rgba(0, 0, 0, 0.35)',
                fontWeight: '200',
              }}
            >
              {nowFile.name}
            </Divider>
          </Col>
          {/* 图片显示 */}
          {
            imgs.map((item, index) => (
              <Col xl={4} lg={6} md={6} sm={12} xs={12}>
                <Card
                  className={styles.imgCase}
                  hoverable
                  bordered={false}
                  style={
                    item.choose ? { boxShadow: '0 0 10px rgba(74, 168, 255, 0.6)' } : null
                  }
                  actions={[
                    <Tooltip title="移动到...">
                      <Icon
                        type="folder"
                        key="folder"
                        onClick={e => {
                          e.stopPropagation();
                          dispatch({
                            type: 'gallery/save',
                            payload: {
                              toMoveImg: item,
                              toMoveImgState: true,
                              toMoveImgDist: 0,
                            },
                          })
                        }}
                      />
                    </Tooltip>,
                    <Tooltip title="查看大图">
                      <Icon
                        type="zoom-in"
                        key="zoom-in"
                        onClick={e => {
                          e.stopPropagation();
                          dispatch({
                            type: 'gallery/save',
                            payload: {
                              bigImgState: true,
                              bigImg: item.name,
                            },
                          });
                        }}
                      />
                    </Tooltip>,
                    <Tooltip title={item.count === 0 ? '删除图片' : '被引用的图片无法删除'}>
                      <Icon
                        type={item.count === 0 ? 'delete' : 'exclamation-circle'}
                        key="close"
                        onClick={e => {
                          e.stopPropagation();
                          if (item.count === 0) {
                            dispatch({
                              type: 'gallery/save',
                              payload: {
                                toDeleteImgState: true,
                                toDeleteImg: item,
                              },
                            });
                          }
                        }}
                      />
                    </Tooltip>,
                  ]}
                  cover={
                    <div className={styles.imgBox}>
                      <div className={styles.img}>
                        <img
                          className={styles.imgSelf}
                          src={`http://pull.wghtstudio.cn/img/${item.name}`}
                          alt="图片未能正常显示"
                        />
                      </div>
                      {item.choose ?
                        <div className={styles.imgAfter}>
                          <p><Icon type="check"/></p>
                        </div>
                        :
                        <div/>
                      }
                    </div>
                  }
                  onClick={() => {
                    dispatch({
                      type: 'gallery/dealSelected',
                      payload: {
                        index,
                      },
                    });
                  }}
                >
                  <Card.Meta
                    title={item.count === 0 ? '此图未被引用' : `被引用 ${item.count} 次`}
                    description={`上传于 ${item.upload_time}`}
                  />
                </Card>
              </Col>
            ))
          }
        </Row>
        {/* 分页 */}
        <Row className={styles.imgGroup} gutter={[0, 0]} align="top">
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <div
              className={styles.morePage}
              onClick={() => {
                dispatch({
                  type: 'gallery/morePage',
                })
              }}
            >
              <p>{(page + 1) * 12 >= count ? '没有更多了哦~' : '加载更多...'}</p>
            </div>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Notice;
