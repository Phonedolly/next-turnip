import { onLoginSuccess } from '@/lib/client/login';
import axios from 'axios'
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from "react-query";

export default function Manage(props) {
  const router = useRouter();
  const [newPm2Config, setNewPm2Config] = useState('');
  const [newDotEnv, setNewDotEnv] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [isBuildFinished, setIsBuildFinished] = useState(false);
  const [isBuildSuccess, setIsBuildSuccess] = useState(true);

  const { data: buildStatus, refetch: getBuildStatus } = useQuery('getBuildStatus',
    () => axios.get('/api/getBuildStatus').then(({ data }) => {
      if (data.isBuildFinished === true) {
        setIsBuilding(false);
        setIsBuildFinished(true);
        if (data.isBuildSuccess === true) {
          setIsBuildSuccess(true)
        } else {
          setIsBuildSuccess(false);
        }
      } else if (data.isBuildFinished === false && data.log.length > 0) {
        setIsBuilding(true);
      }
      console.log(data);
      return data

    }).catch(e => {
      console.log('Build status is not available');
    }),
    {
      enabled: isBuildFinished === false,
      refetchOnWindowFocus: false,
      refetchInterval: 300,
      refetchIntervalInBackground: true,
      retryDelay: 1000,
    }
  )

  const { status: getConfigStatus, data: config, refetch: getConfig } = useQuery('getBuildConfig',
    () => axios.get('/api/getBuildConfig', { withCredentials: true }).then(({ data }) => {
      setNewPm2Config(data.pm2Config);
      setNewDotEnv(data.dotEnv);
      return data;
    }).catch(e => {
      console.log(e)
    }),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      retry: 0
    }
  )
  const { status: loginCheckStatus, data: isSilentRefreshSuccess } = useQuery('silentRefresh',
    () => axios.get('/api/auth/silentRefresh', { withCredentials: true }).then(({ data }) => {
      onLoginSuccess(data.accessToken)
      getConfig();
      return data.isSilentRefreshSuccess
    }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      retry: 0
    }
  );

  const handleEcosystemTab = (e) => {
    if (e.keyCode === 9) {
      e.preventDefault();
      let val = e.target.value;
      let start = e.target.selectionStart;
      let end = e.target.selectionEnd;
      e.target.value = val.substring(0, start) + "\t" + val.substring(end);
      e.target.selectionStart = e.target.selectionEnd = start + 1;
      setNewPm2Config(e.target.value);
      return false; //  prevent focus
    }
  };

  const handleDotEnvTab = (e) => {
    if (e.keyCode === 9) {
      e.preventDefault();
      let val = e.target.value;
      let start = e.target.selectionStart;
      let end = e.target.selectionEnd;
      e.target.value = val.substring(0, start) + "\t" + val.substring(end);
      e.target.selectionStart = e.target.selectionEnd = start + 1;
      setNewDotEnv(e.target.value);
      return false; //  prevent focus
    }
  };

  if (loginCheckStatus === 'success' && isSilentRefreshSuccess === true) {
    return (
      <>
        <div>
          <textarea
            onChange={(e) =>
              setNewPm2Config(e.target.value)}
            onKeyDown={(e) => handleEcosystemTab(e)}
            defaultValue={newPm2Config}
            style={{ width: "50vw", height: "80vh" }} />
          <p>ecosystem.config.js</p>
        </div>
        <div>
          <textarea
            onChange={(e) =>
              setNewDotEnv(e.target.value)}
            onKeyDown={(e) => handleDotEnvTab(e)}
            defaultValue={newDotEnv}
            style={{ width: "50vw", height: "80vh" }} />
          <p>.env</p>
        </div>
        <button
          onClick={() => {
            axios.post('/api/setBuildConfig', { newPm2Config, newDotEnv }).then(({ data }) => {
              if (data.isSetBuildConfigSuccess === true) {
                alert('update complete!');
              }
            })
          }}>update config</button>
        <button onClick={() => {
          setIsBuilding(true);
          axios.get('/api/startBuild').then(({ data }) => {
            console.log(data);
            setIsBuildFinished(false);
          })
        }}>
          build
        </button>
        <textarea value={buildStatus?.log || undefined}
          style={{ width: "50vw", height: "80vh" }} />
        {isBuildFinished === true ? isBuildSuccess ? "Build Finished!" : "Build Failed!" : (isBuilding === true ? "Building..." : null)}
      </>
    )
  } else if (loginCheckStatus === 'success' && isSilentRefreshSuccess === false) {
    router.replace('/');
  } else {

  }
}