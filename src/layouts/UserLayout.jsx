import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import styles from './UserLayout.less';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    formatMessage,
    ...props,
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.content} style={{ marginTop: '40px' }}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <span role="img" aria-label="" style={{ fontSize: '24px', marginRight: '20px' }}>
                  👿
                </span>
                <span className={styles.title}>Fxxk Design</span>
              </Link>
            </div>
            <div className={styles.desc}>
              Fxxk
              Design是中国湖南省长沙市岳麓区湖南大学信息科学与工程学院2017级软件1703班最具影响力的
              Web 设计规范
            </div>
          </div>
          {children}
        </div>
        <DefaultFooter />
      </div>
    </>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
