import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { onLoginSuccess } from "@/lib/client/login";
import { useQuery } from "react-query";

export default function Login(props) {
  const [isLoggedIn, setLoggedIn] = useState("PENDING");
  const [id, setID] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { status, data, error, isLoading } = useQuery("silentRefresh",
    () => axios.get('/api/auth/silentRefresh', { withCredentials: true }),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      retry: 0
    });

  useEffect(() => {
    if (status === "success" && data?.data.isSilentRefreshSuccess === true) {
      console.log(data.data);
      onLoginSuccess(data.data.accessToken);
      console.log(axios.defaults.headers.common)
      setLoggedIn(true)
    } else {
      setLoggedIn(false);
    }
  }, [data, status]);

  const login = () => {
    const authData = {
      id,
      password,
    };
    axios.post(`/api/auth/login`, authData).then(
      ({ data }) => {
        if (data.isLoginSuccess === true) {
          onLoginSuccess(data.accessToken);
          alert("로그인 성공");
          router.replace(`/`);
        }
        else {
          alert("로그인 정보가 맞지 않습니다.");
        }

      });
  };

  const logout = () => {
    axios.get("/api/auth/logout", { withCredentials: true })
      .then(
        () => alert("로그아웃 되었습니다")
      ).catch(() => {
        alert("로그아웃 실패");
      })
  };
  if (isLoggedIn === true) {
    return <>
      <button onClick={logout}>로그아웃</button>
      <p>이미 로그인되어 있습니다</p>
    </>
  }
  else if (isLoggedIn === false && status === "success") {
    return (
      <>
        <input
          placeholder="ID"
          type="text"
          name="username"
          onChange={(e) => setID(e.target.value)}
          required
        ></input>
        <input
          placeholder="Password"
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        ></input>
        <button onClick={login}>로그인</button>
      </>
    )
  }
  else {
    return (
      <p>loading</p>
    )
  }
};
