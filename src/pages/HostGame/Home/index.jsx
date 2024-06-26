import { useEffect, useState } from "react";
import theme from "../../../components/css/theme";
import { styled } from "styled-components";
import { updateRealTime } from "../../../utils/reviseRealTime";

const WrapHome = styled.div`
  ${theme.breakpoints.sm} {
    background-color: ${theme.colors.secondary}66;
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: end;
    position: absolute;
    right: 0;
    width: 20%;
  }
`;

const TimeLimit = styled.div`
  position: absolute;
  bottom: 50%;
  padding: 2rem;
  background-color: ${theme.colors.secondary}66;
  color: ${theme.colors.info};
  font-size: 5rem;
  width: auto;
  height: 8rem;
  line-height: 4rem;

  ${theme.breakpoints.sm} {
    position: static;
    background-color: #ffffff00;
    font-size: 4rem;
  }
`;

const Attendant = styled.div`
  position: absolute;
  bottom: 55%;
  padding: 1rem;
  right: 0;
  background-color: ${theme.colors.secondary}66;
  color: ${theme.colors.info};
  font-size: 2rem;
  width: 16rem;
  height: 11rem;
  line-height: 4rem;

  p {
    font-size: 4.4rem;
  }

  ${theme.breakpoints.sm} {
    position: static;
    background-color: #ffffff00;
    font-size: 1.4rem;
    p {
      font-size: 3rem;
    }
  }
`;

const Home = ({
  getUrlDocumentId,
  timeoutSec,
  audioRef,
  reply,
  setReply,
  arrayUsers,
}) => {
  const [count, setCount] = useState(timeoutSec);

  useEffect(() => {
    setCount(timeoutSec);
  }, [timeoutSec]);

  useEffect(() => {
    const num = arrayUsers.filter(
      (user) => user.selected !== undefined
    )?.length;
    arrayUsers && setReply(num);
  }, [arrayUsers]);

  useEffect(() => {
    const countDown = setInterval(() => {
      setCount(count - 1);
      if (count <= 0) {
        setCount(0);
        updateRealTime(`${getUrlDocumentId}`, { state: "timeout" });
      }
    }, 1000);

    return () => clearInterval(countDown);
  }, [count]);

  return (
    <WrapHome>
      <TimeLimit>{count}</TimeLimit>
      <Attendant>
        作答人數<p>{reply}</p>
      </Attendant>{" "}
      <audio autoPlay loop src="/bgm/game.mp3" ref={audioRef} />
    </WrapHome>
  );
};

export default Home;
