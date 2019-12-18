import {
  Affix,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Icon,
  Input,
  Modal,
  Popover,
  Row,
  Select,
  Tooltip,
  Upload,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
// import Authorized from '../../utils/Authorized';

import styles from './style.less';

@connect(({ gallery }) => ({
  gallery,
}))
class Notice extends Component {
  state = {};

  arr = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'gallery/allRefresh',
    })
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
    } = gallery;
    const { Option } = Select;
    const { TextArea } = Input;
    const dealNewFile = (
      <div>
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
    )
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
                title="刷新"
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
            <div
              className={styles.showImg}
            >
              {
                toMoveImg.img_id === 0 ? <div/> :
                  <img
                    src={`http://pull.wghtstudio.cn/img/${toMoveImg.name}`}
                    alt=""
                  />
              }
            </div>
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
                    files.map(item => {
                      console.log(item.id);
                      return <Option
                        value={item.id}
                        disabled={item.id === 0 || item.id === toMoveImg.file_id}
                      >
                        {item.name}
                      </Option>;
                    })
                  }
                </Select>
              </p>
            </div>
          </div>
        </Modal>
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
            <div
              className={styles.showImg}
            >
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
            <div>
              <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                <Icon type="exclamation-circle" style={{ margin: 'auto 6px' }}/>
                消息发布后 APP 用户将看到您的推荐消息，您可以在 [推荐消息管理页] 管理已经发布的推荐消息。
              </p>
            </div>
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
        <Modal
          title="上传图片"
          visible={uploadState}
          onCancel={() => {
            dispatch({
              type: 'gallery/save',
              payload: {
                uploadState: false,
              },
            });
          }}
        >
          <div>
            <p>你好</p>
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
              onChange={() => {

              }}
            >
              <div>
                <Icon type="plus" />
                <div className="ant-upload-text">开始上传</div>
              </div>
            </Upload>
          </div>
        </Modal>
        <div className={styles.floatBar}>
          {selected.length === 0 ?
            <div>
              <p style={{
                color: 'rgba(0, 0, 0, 0.45)',
                fontSize: '16px',
              }}>未选择任何图片</p>
            </div>
            :
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
                  >
                    清空
                  </span>
                </span>
              </p>
            </div>
          }
        </div>
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
        <div className={styles.file}>
          <Affix offsetTop={80}>
            <Row className={styles.fileGroup} gutter={[30, 30]} align="top">
              <Col xl={6} lg={8} md={8} sm={12} xs={12}>
                <div className={styles.fileBlock}>
                  <div className={styles.fileBlockContent}>
                    <img
                      className={styles.fileImg}
                      src="https://s2.ax1x.com/2019/12/11/QsuV2t.jpg"
                      alt=""
                    />
                  </div>
                  <div className={styles.fileBlockAfter}>
                    <p>{nowFile.name}{nowFile.id === 0 ? <div/> :
                      <Icon
                        type="edit"
                        style={{ color: 'rgba(255, 255, 255, 0.6)' }}
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
                      src="https://s2.ax1x.com/2019/12/11/QsuV2t.jpg"
                      alt=""
                    />
                  </div>
                  <div className={styles.fileBlockAfter}>
                    {newFile ? dealNewFile : <p><Icon type="plus"/> 新建图集</p>}
                  </div>
                </div>
              </Col>
              {files.map(item => {
                console.log('index');
                return (item.id === nowFile.id ? <div/> : (
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
                        <img className={styles.fileImg}
                             src="https://s2.ax1x.com/2019/12/11/QsuV2t.jpg" alt=""/>
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
                ))
              })
              }
            </Row>
          </Affix>
        </div>
        <Row className={styles.imgGroup} gutter={[0, 0]} align="top">
          {
            imgs.map((item, index) => {
              console.log(item);
              return (
                <Col xl={4} lg={6} md={6} sm={12} xs={12}>
                  <Card
                    className={styles.imgCase}
                    hoverable
                    bordered={false}
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
                      <Tooltip title="下载图片">
                        <Icon
                          type="download"
                          key="download"
                          onClick={e => {
                            e.stopPropagation();
                            const link = new XMLHttpRequest();
                            link.open(
                              'GET',
                              `http://pull.wghtstudio.cn/img/${item.name}`,
                              true,
                            );
                            link.onload = () => {
                              const url = window.URL.createObjectURL(link.response);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = item.img_id;
                              a.click();
                            }
                            link.send();
                          }}
                        />
                      </Tooltip>,
                      <Tooltip title={item.count === 0 ? '删除图片' : '被引用的图片无法删除哦~'}>
                        <Icon
                          type={item.count === 0 ? 'close' : 'exclamation-circle'}
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
                      title={`已被引用 ${item.count} 次`}
                      description={`上传于 ${item.upload_time}`}
                    />
                  </Card>
                </Col>
              )
            })
          }
        </Row>
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
