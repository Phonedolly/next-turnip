import axios from 'axios'


export const onLoginSuccess = (accessToken) => {
  // accessToken 설정
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  // refreshToken 설정
  // setCookie("refreshToken", refreshToken);

  // accessToken 만료하기 1분 전에 로그인 연장
  setTimeout(onSilentRefresh, process.env.NEXT_PUBLIC_JWT_EXPIRY_TIME - 60000);
};



export const onSilentRefresh = () =>
  new Promise((resolve, reject) => {
    axios
      .get("/api/auth/silentRefresh")
      .then(({data}) => {
        if (data.isSilentRefreshSuccess) {
          onLoginSuccess(data.accessToken)
          resolve(true)
        } else {
          reject(false)
        }
      })
  })


export const onGetAuth = () =>
  new Promise((resolve, reject) => {
    axios.get('/api/auth/check')
      .then((res) => {
        if (res.data.isAuthSuccess) {
          resolve(true)
        } else {
          reject(false)
        }
      })
  })