import { Col, Row, Icon, Tag } from 'antd';
import React from 'react';
import styles from './index.less';

export default ({ hello }) => (
    <React.Fragment>
    <Row gutter={24}>
      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <div className={styles.winner}>
                <div className={styles.title}>
                  <p>#1</p>
                </div>
                <div >
<span className={styles.num}>{hello}</span>
                  <span className={styles.name}><Icon type="user" /> <Tag >{'我起的名字一定要长长长长'}</Tag></span>
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
                  <p>1234567</p>
                </div>
                <div className={styles.name}>
                  <p><Icon type="user" />  <Tag >{'我起的名字一定要长长长长'}</Tag></p>
                </div>
              </div>
              </Col>
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <div className={styles.second}>
                <div className={styles.title}>
                  <p>#3</p>
                </div>
                <div className={styles.num}>
                  <p>1234567</p>
                </div>
                <div className={styles.name}>
                  <p><Icon type="user" />  <Tag >{'我起的名字一定要长长长长'}</Tag></p>
                </div>
              </div>
              </Col>
    </Row>
    </React.Fragment>
  )
