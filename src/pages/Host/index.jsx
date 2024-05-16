import React, { useEffect, useRef } from "react";
import PrimaryBg from "../../components/css/PrimaryBg";
import theme from "../../components/css/theme";
import Buttons from "../../components/Buttons";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import { removeRealTime, updateRealTime } from "../../utils/reviseRealTime";
import { QRCodeCanvas } from "qrcode.react";
import { useGetRealTimeNavigate } from "../../utils/hook/useGetRealTime";
import { useOnAuthStateChange } from "@/utils/hook/useOnAuthStateChange";
import { Timestamp } from "firebase/firestore";
import { useStore } from "@/utils/hook/useStore";
import { ScrollArea } from "@/components/ui/scroll-area";

const WrapHost = styled(PrimaryBg)`
  display: flex;
  flex-direction: column;
`;

const WrapHome = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
`;

const Logo = styled.img`
  height: 6rem;
  width: auto;
`;

const JoinCode = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  gap: 2rem;

  ${theme.breakpoints.sm} {
    flex-direction: column;
  }
`;

const WrapCode = styled.div`
  background-color: ${theme.colors.light};
  height: 8rem;
  width: 30rem;
  text-align: left;
  border-radius: 6px;
  div {
    padding: 0 2rem;
    height: 3.6rem;
  }
  p {
    padding: 0 2rem;
    font-size: 6rem;
  }

  ${theme.breakpoints.sm} {
    width: auto;
    div {
      padding: 0 2rem;
      height: 3.6rem;
    }
    p {
      padding: 0 2rem;
      font-size: 5rem;
    }
  }
`;

const WrapParticipants = styled(ScrollArea)`
  height: calc(100vh - 30rem);
`;

const Participants = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 2rem;
  line-height: 3rem;
  height: auto;
  width: auto;
  font-size: 2.4rem;

  p {
    padding: 1rem;
    background-color: ${theme.colors.light};
  }
`;

const Attenance = styled.div`
  position: absolute;
  bottom: 4rem;
  left: 4rem;
  padding: 2rem 0.5rem;
  background-color: ${theme.colors.tertiary}66;
  color: ${theme.colors.light};
  font-size: 4rem;
  width: 10rem;
  height: 8rem;
  line-height: 4rem;
  border-radius: 5px;

  p {
    font-size: 1.4rem;
    right: 0.5rem;
    bottom: 0;
    position: absolute;
  }
`;

const SoundButton = styled.div`
  position: absolute;
  right: 4rem;
  bottom: 4rem;
  background-color: ${({ $isPlayBgm }) => ($isPlayBgm ? "#e8c83b" : "#b69e35")};
  box-shadow: 0 3.4px 0px 0 #b69e35;

  width: 10rem;
  height: 8rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const StartBtn = styled.div`
  position: absolute;
  bottom: 13rem;
  right: 4rem;
`;

const DashboardBtn = styled.div`
  position: absolute;
  bottom: 13rem;
  left: 4rem;
`;

const Host = () => {
  const audioRef = useRef(null);
  const { isPlayBgm, setIsPlayBgm } = useStore();

  const navigate = useNavigate();

  const { pin: getUrlPin, documentId: getUrlDocumentId } = useParams();
  const {
    data: realTimeData,
    isError: isRTError,
    isLoading: isRTLoading,
  } = useGetRealTimeNavigate(getUrlDocumentId, "/dashboard");
  const eventData = realTimeData;
  const { users = {} } = eventData || {};

  useOnAuthStateChange();

  window.onpopstate = () => {
    const confirmLeave = window.confirm("確定要離開當前頁面嗎?");

    if (confirmLeave) {
      removeRealTime(getUrlDocumentId);
      navigate("/dashboard");
    } else {
      navigate(`/host/${getUrlDocumentId}/${getUrlPin}`);
    }
  };

  useEffect(() => {
    function handleBeforeUnload(e) {
      e.preventDefault();
      e.returnValue = "確定要離開當前頁面嗎?";
    }

    function handleUnload(e) {
      removeRealTime(getUrlDocumentId);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current !== null && isPlayBgm) audioRef.current.muted = false;
  }, [audioRef.current, isPlayBgm]);

  useEffect(() => {
    if (audioRef.current !== null) {
      isPlayBgm
        ? (audioRef.current.muted = false)
        : (audioRef.current.muted = true);
    }
  }, [isPlayBgm, audioRef]);

  function handleState() {
    updateRealTime(getUrlDocumentId, { state: "game", time: Timestamp.now() });
    navigate(`/hostgame/${getUrlDocumentId}`);
  }

  function handleDashboard() {
    navigate(`/dashboard`);
    removeRealTime(getUrlDocumentId);
  }

  return (
    <WrapHost>
      <WrapHome>
        {" "}
        <JoinCode>
          <WrapCode>
            <div>遊戲PIN碼：</div>
            <p>{getUrlPin}</p>
          </WrapCode>
          <QRCodeCanvas
            value={`https://loody-ing.web.app/part/${getUrlDocumentId}/${getUrlPin}`}
            bgColor={`${theme.colors.primary}`}
            fgColor={`${theme.colors.tertiary}`}
            level={"L"}
            size={window.innerWidth < 940 ? 130 : 190}
          />
        </JoinCode>
        <WrapParticipants>
          <Participants>
            {Object.values(users)?.map(
              (user, index) => user.isOnline && <p key={index}>{user.name}</p>
            )}
          </Participants>
        </WrapParticipants>
        <DashboardBtn onClick={handleDashboard}>
          <Buttons type="success">首頁</Buttons>
        </DashboardBtn>
        {users && (
          <Attenance>
            {Object.keys(users).length}
            <p>人</p>
          </Attenance>
        )}
        {Object.keys(users).length !== 0 && (
          <StartBtn onClick={handleState}>
            <Buttons>開始</Buttons>
          </StartBtn>
        )}
        <SoundButton type="sound" onClick={setIsPlayBgm} $isPlayBgm={isPlayBgm}>
          {isPlayBgm ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-16 h-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-16 h-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
              />
            </svg>
          )}
        </SoundButton>
      </WrapHome>{" "}
      <audio autoPlay loop src="/bgm/game.mp3" ref={audioRef} />
    </WrapHost>
  );
};

export default Host;
