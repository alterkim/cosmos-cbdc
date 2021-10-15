import { faChevronLeft, faHome, faBars, faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { history } from "../../_helpers"
import React, {useState} from "react"
import styled from "styled-components"
import { dbService } from "../../fbase"

const OverseasStatusPage = ({userInfo}) => {
    return (
        <div>
            <Header>
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw', cursor: 'pointer'}}
                    onClick={() => history.push('/personal/overseastransfer')}/>
                <HeaderText style={{marginLeft: 40}}>CBDC 해외송금 진행상태 조회</HeaderText>
                <div>
                    <FontAwesomeIcon icon={faHome} style={{color: "#000", fontSize: '4vw', marginRight: 15}}/>
                    <FontAwesomeIcon icon={faBars} style={{color: "#000", fontSize: '4vw', marginRight: '5vw'}}/>
                </div>
            </Header>
            <Body>
                <div style={{display:'flex', flexDirection: 'column', justifyContent:'center', width: '100%', marginTop: '2vh'}}>
                    <div style={{margin: 'auto', fontSize: '3.4vw'}}>3개월 이내의 거래 내역만 조회 가능합니다.</div>
                    <div style={{display: 'flex', justifyContent:'space-evenly', marginTop: '2vh'}}>
                        <MonthButton>1개월</MonthButton>
                        <MonthButton style={{backgroundColor: '#00b2a7', color: 'white'}}>2개월</MonthButton>
                        <MonthButton>3개월</MonthButton>
                    </div>
                </div>
            </Body>
        </div>
    )
}

export {OverseasStatusPage}

const Header = styled.div`
    background-color: #fff;
    height: 6.76vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    font-size: 4vw;
    font-weight: 600;
`
const Body = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: #f6f6f6; 
`
const HeaderText = styled.div`
    color: #000;
`
const MonthButton = styled.div`
    background-color: #f6f6f6;
    border-radius: 20px;
    border: 1px solid gray;
    font-size: 3.2vw;
    width: 18vw;
    padding: 0.7vh 1.8vw;
    text-align: center;
    cursor: pointer;
    color: gray;
`