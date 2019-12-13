import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import PageLoading from '@/components/PageLoading';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentWillMount() {
    this.setState({
      isReady: true,
    });
    const userID = sessionStorage.getItem('userID');
    if (userID) {
      this.props.dispatch({
        type: 'login/fetchUserInfo',
        payload: userID,
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading } = this.props;
    const isLogin = sessionStorage.getItem('userID');
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!isLogin) {
      return <Redirect to={`/user/login?${queryString}`} />;
    }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
