import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from 'swr';

import { onLoginSuccess } from "@/lib/client/login";

const slientRefreshFetcher = async url => await axios.get(url).then(res => res.data);

export default function Login(props) {
  const [isLoggedIn, setLoggedIn] = useState("PENDING");
  const [id, setID] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data, error, isLoading } = useSWR(`/api/auth/silentRefresh`, slientRefreshFetcher);

  console.log(data);

  // useEffect(() => {
  //   async function setLoginInfo() {
  //     await onSilentRefresh;
  //     onGetAuth().then(
  //       () => {
  //         setLoggedIn("YES");
  //       }
  //     ).catch(() => {
  //       setLoggedIn("NO");
  //     })
  //   }
  //   setLoginInfo();
  // }, []);

  const login = () => {
    const authData = {
      id,
      password,
    };
    axios.post(`/api/auth/login`, authData).then(
      ({ data }) => {
        console.log(data);
        if (data.isLoginSuccess) {
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
    axios.get("/api/auth/logout")
      .then(
        () => alert("로그아웃 되었습니다")
      ).catch(() => {
        alert("로그아웃 실패");
      })
  };
  if (isLoggedIn === "YES") {
    return <>이미 로그인되어 있습니다</>;
  }
  if (data)
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
        {/* <button onClick={onSilentRefresh} />
      <button onClick={onGetAuth} /> */}
        <button onClick={logout}>로그아웃</button>
      </>
    );
};

// export async function getServerSideProps() {

// }