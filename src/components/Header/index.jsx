import React, { useEffect, useState } from "react";
import theme from "../css/theme";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "@/utils/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetFireStore } from "@/utils/hook/useGetFireStore";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Buttons from "../Buttons";
import { useOnAuthStateChange } from "@/utils/hook/useOnAuthStateChange";

const auth = getAuth(app);

const WarpHeader = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.primary};

  height: 6rem;
  justify-content: space-between;
  padding: 0 3rem;
`;

const Logo = styled.img`
  height: 4rem;
  width: auto;
  cursor: pointer;
`;

const Logout = styled.div`
  position: absolute;
  left: 2rem;
  bottom: 2rem;
`;

const WrapAvatar = styled(Avatar)`
  width: 4rem;
  height: 4rem;
`;

const WrapSheetContent = styled(SheetContent)`
  max-width: 30rem;
  background-color: ${theme.colors.primary};
  text-align: left;
  display: flex;
  flex-direction: column;
`;

const SheetUserImg = styled(WrapAvatar)`
  height: 6rem;
  width: 6rem;
`;

const SheetName = styled.h3``;
const SheetEmail = styled.p`
  color: #7d7a70;
  line-height: 0.5rem;
`;
const SheetHr = styled.hr`
  border: none;
  height: 1px;
  margin: 2rem 0;
  background-color: #ffffff;
`;

const Header = ({ children }) => {
  const [isLogoutBtn, setIsLogoutBtn] = useState(false);
  const [uid, setUid] = useState(null);
  const {
    data: getUserData,
    isLoading,
    isError,
  } = useGetFireStore("users", uid);

  const userUid = useOnAuthStateChange();

  useEffect(() => {
    setUid(userUid);
  }, [userUid]);

  const navigate = useNavigate();
  function handleHome() {
    navigate("/");
  }

  function handleUserBtn() {
    setIsLogoutBtn(!isLogoutBtn);
  }

  function handleLogout() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
        console.log("Sign-out successful");
      })
      .catch((error) => {
        // An error happened.
        console.log("Sign-out error");
      });
  }

  return (
    <WarpHeader>
      <Logo src="/logo.png" alt="" onClick={handleHome} />
      {children}
      {/* <Buttons>登入</Buttons> */}
      <Sheet>
        <SheetTrigger>
          {" "}
          <WrapAvatar onClick={handleUserBtn}>
            <AvatarImage src="" />
            <AvatarFallback>{getUserData?.name.slice(0, 2)}</AvatarFallback>
          </WrapAvatar>
        </SheetTrigger>
        <WrapSheetContent>
          <SheetUserImg onClick={handleUserBtn}>
            <AvatarImage src="" />
            <AvatarFallback>{getUserData?.name.slice(0, 2)}</AvatarFallback>
          </SheetUserImg>
          <SheetName>{getUserData?.name}</SheetName>
          <SheetEmail>{getUserData?.email}</SheetEmail>
          <SheetHr />
          <Logout onClick={handleLogout}>
            <Buttons>登出</Buttons>
          </Logout>
        </WrapSheetContent>
      </Sheet>

      {/* {isLogoutBtn && <Logout onClick={handleLogout}>登出</Logout>} */}
    </WarpHeader>
  );
};

export default Header;
