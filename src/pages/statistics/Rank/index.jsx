import { Col, Row, Icon, Tag } from 'antd';
import React from 'react';
import styles from './index.less';

export default ({ data, type, kind }) => {
  // 按 type 对象显示图标
  const icon = type === 0 ? <Icon type="tag" /> : <Icon type="user" />;
  // 按 kind 类型显示图标
  let most = null;
  switch (kind) {
    case 'like':
      most = <Icon type="like" className={styles.icon} />;
      break;
    case 'collect':
      most = <Icon type="star" className={styles.icon} />;
      break;
    case 'comment':
      most = <Icon type="message" className={styles.icon} />;
      break;
    case 'follow':
      most = <Icon type="eye" className={styles.icon} />;
      break;
    case 'post':
      most = <Icon type="carry-out" className={styles.icon} />;
      break;
    default:
      most = <Icon type="question" className={styles.icon} />;
      break;
  }
  // 如果data长度小于3，那么补齐， 避免数组元素本身的undefine问题。
  while (data.length < 3) {
    data.push({
      tag: '??',
      name: '??',
      num: 123,
    });
  }
  // 主要内容
  const contentBase = (
    <React.Fragment>
      <Row gutter={24}>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <div className={styles.winner}>
            <div className={styles.title}>
              <p>#1</p>
            </div>
            <div>
              <span className={styles.num}>
                {most}
                {data[0].num === undefined ? 123 : data[0].num}
              </span>
              <span className={styles.name}>
                {icon} <Tag>{data[0].tag === undefined ? data[0].name : data[0].tag}</Tag>
              </span>
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className={styles.second}>
            <div className={styles.title}>
              <p>#2</p>
            </div>
            <div className={styles.num}>
              <p>{data[1].num === undefined ? 123 : data[1].num}</p>
            </div>
            <div className={styles.name}>
              <p>
                {icon} <Tag>{data[1].tag === undefined ? data[1].name : data[1].tag}</Tag>
              </p>
            </div>
          </div>
        </Col>
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className={styles.second}>
            <div className={styles.title}>
              <p>#3</p>
            </div>
            <div className={styles.num}>
              <p>{data[2].num === undefined ? data[2].name : data[2].num}</p>
            </div>
            <div className={styles.name}>
              <p>
                {icon} <Tag>{data[2].tag === undefined ? data[2].name : data[2].tag}</Tag>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
  const content = data === undefined ? <React.Fragment /> : contentBase;
  return content;
};
