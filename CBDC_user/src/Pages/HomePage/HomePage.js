import React from "react"
import styled from "styled-components"
import { history } from '../../_helpers';

const HomePage = () => {
  return (
    <div>
      <HomeLayout>
        <HomeLogo src="images/logo.png" />
        <HomeVersion>
          CBDC 기술검증 DEMO ver. 1.0 
        </HomeVersion>
        <ButtonGroup>
          <HomeButton onClick={() => history.push("/personal")}>개인</HomeButton>
          <HomeButton onClick={() => history.push("/affiliate")}>가맹점</HomeButton>
          <HomeFooterLogo src="images/footer-logo.png" />
        </ButtonGroup>
        <HomeFooterLayout>
          <HomeFooterText>
          </HomeFooterText>
          <HomeFooterText>
          </HomeFooterText>
          <HomeLodingBar>
            <HomeLodingBarProgress></HomeLodingBarProgress>
          </HomeLodingBar>
        </HomeFooterLayout>
      </HomeLayout>
    </div>
  );
}

export { HomePage };

const HomeLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  position: relative;
  height: 100vh;
`

const HomeLogo = styled.img`
  margin-top: 15vh;
  width: 50vw;
`

const HomeVersion = styled.div`
  margin-top: 10px;
  font-size: 4.28vw;
  // font-weight: 600;
  border: 1px solid #8d8e8e;
  border-radius: 20px;
  padding: 1.08vh 5.2vw;
  color: #8d8e8e;
`
const HomeFooterLayout = styled.div`
  position: absolute;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;  
`
const HomeFooterText = styled.div`
  font-size: 2.93vw;
  text-align: center;
  color: #696a6a;
  font-weight: 600;
  margin-bottom: 5px;
`
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: min-content;
  margin: auto;
`
const HomeButton = styled.button`
  width: 77.87vw;
  height: 6.96vh;
  background-color: #00b2a7;
  color: #fff;
  font-weight: 600;
  font-size: 5.33vw;
  border-radius: 6.67vw;
  border: none;
  margin: 5px;
  cursor : pointer;
`
const HomeFooterLogo = styled.img`
  width: 34vw;
  margin: 2vh auto;
`
const HomeLodingBar = styled.div`
  width: 100vw;
  height: 4px;
  background-color: #d6d7d9;
  border-radius: 2px;
`
const HomeLodingBarProgress = styled.div`
  width: 70%;
  height: 4px;
  background-color: #00b2a7;
  border-radius: 2px;
`