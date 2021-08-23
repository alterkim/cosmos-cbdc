import React, {useState } from "react"
import styled from "styled-components"
import { faChevronLeft, faTimes, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { history } from '../../_helpers';
import { dbService, firebaseInstance } from "../../fbase";
import GetDatetime from "../../_helpers/GetDatetime";
import TokenTransfer from "../../_helpers/TokenTransfer";

const AccountComponent = ({userInfo,state}) =>{
    return(
        <>
            <div style={{marginTop: "6.76vh", display: 'flex', alignItems: 'center', borderBottom: '1px solid #888888', width: '90vw', height: 40}}>
                <div style={{color: '#000', fontSize: '3.5vw'}}>{state ? "입금계좌번호" : "출금계좌번호"}</div>
                <select className="select"
                    style={{
                        width: 170, 
                        height: 40,
                        fontSize: '3.5vw', 
                        textAlign: "right", 
                        border: 'none', 
                        outline: 'none',
                        marginLeft: 'auto',
                        marginRight: 0
                    }}>
                    <option>{userInfo.account}</option>
                </select>
            </div>
            <div style={{marginTop: '4vh', borderBottom: '1px solid #000', display: 'flex', alignItems: 'center', width: '90vw', height: 40}}>
                <div style={{color: '#000', fontSize: '3.5vw'}}>잔액</div>
                <div style={{color: '#000', marginLeft: 'auto', fontSize: '3.5vw'}}>{userInfo.fiat_balance&&userInfo.fiat_balance.toLocaleString()} 원</div>
            </div>
        </>
    )
}

const WalletComponent = ({userInfo,state}) =>{
    return (
        <>
            <div style={{marginTop: "6.76vh", display: 'flex', alignItems: 'center', borderBottom: '1px solid #000', width: '90vw', height: 40}}>
                <div style={{color: '#000', fontSize: '3.5vw'}}>{state ? "출금지갑주소" : "입금지갑주소"}</div>
                <select className="select"
                    style={{
                        width: 170, 
                        height: 40,
                        fontSize: '3.5vw', 
                        textAlign: "right",
                        border: 'none', 
                        outline: 'none',
                        marginLeft: 'auto',
                        marginRight: 0
                    }}>
                    <option>{userInfo.wallet_account}</option>
                </select>
            </div>
            <div style={{marginTop: '1.5vh', display: 'flex', alignItems: 'center', width: '90vw', height: 30}}>
                <div style={{color: '#414141', 
                            fontSize: '2.5vw', 
                            color: '#8d8e8e',
                            padding: 8,
                            marginLeft: 'auto', 
                            border: '1px solid #8d8e8e', 
                            borderRadius: 10}}>{userInfo.wallet}</div>
            </div>
            <div style={{marginTop: '4vh', borderBottom: '1px solid #000', display: 'flex', alignItems: 'center', width: '90vw', height: 40}}>
                <div style={{color: '#000', fontSize: '3.5vw'}}>잔액</div>
                <div style={{color: '#000', marginLeft: 'auto', fontSize: '3.5vw'}}>{userInfo.common_cbdc_balance&&userInfo.common_cbdc_balance.toLocaleString()} D-KRW</div>
            </div>
        </>
    )
}

const Exchange = ({userInfo,returnPage}) => {
    const [state, setState] = useState(false)
    const [amount, setAmount] = useState(0)

    const onClickArrow=()=>{
        setState(!state)
    }

    const onChangeAmount = (e) =>{
        var val = Number(e.target.value.replace(/\D/g, ''))
        setAmount(val.toLocaleString())
    }
    const onClickExchange = async(e)=>{
        // state:true = CBDC -> Fiat
        // state:false = Fiat -> CBDC
        var val = Number(amount.replace(/\D/g, ''))
        if(val > 0 && 
            (state ? val < userInfo.common_cbdc_balance : val < userInfo.fiat_balance) 
            ){
            var exchangeMoney = val
            if(state){
                exchangeMoney = -exchangeMoney
            }
            await dbService
                .doc(`UserInfo/${userInfo.uid}`)
                .update({
                    common_cbdc_balance : firebaseInstance.firestore.FieldValue.increment(exchangeMoney),
                    fiat_balance : firebaseInstance.firestore.FieldValue.increment(-exchangeMoney)
                })
            
            var datetime = GetDatetime()
            await dbService
                        .collection(`TxInfo`)
                        .add({
                            sender_account : userInfo.account,
                            sender_wallet : userInfo.wallet,
                            sender_name : userInfo.name,
                            receiver_name : userInfo.name,
                            receiver_wallet : userInfo.wallet,
                            receiver_account : userInfo.account,
                            amount : Number(exchangeMoney),
                            transaction_type : "교환",
                            transaction_date : datetime,
                            cbdc_type : "common"
                        })

            TokenTransfer(val)

            history.push(returnPage)
            window.location.reload();
        }
    }
    return (
        <div>
            <Header>
                <FontAwesomeIcon 
                    icon={faChevronLeft} 
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw', cursor:'pointer'}}
                    onClick={() => history.push(returnPage)}
                />
                <HeaderText>교환하기</HeaderText>
                <div>
                    <FontAwesomeIcon icon={faTimes} style={{color: "#000", fontSize: '4vw', marginRight: '5vw'}}/>
                </div>
            </Header>
            <Body>
                
                <CardChild>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div style={{marginTop: '2vw', color: '#00b2a7', fontSize:'3.73vw'}}>교환할 금액을 입력하세요.</div>
                        <div style={{marginTop: '6vw', display: 'flex', alignItems: 'center', position: 'relative'}} onClick={onClickArrow} >
                            <div style={{fontSize: '4vw'}}>{state ? "D-KRW" : "원"}</div>
                            <FontAwesomeIcon icon={faLongArrowAltRight} style={{color: "#00b2a7", fontSize: '4vw', margin: '0 4vw'}} />
                            <div style={{fontSize: '4vw'}}>{state ? "원" : "D-KRW"}</div>
                        </div>
                    </div>
                </CardChild>
                {
                    state ? (
                        <>
                            <AccountComponent userInfo={userInfo} state={state}></AccountComponent>
                            <WalletComponent userInfo={userInfo} state={state}></WalletComponent>
                        </>
                    ):(
                        <>
                            <WalletComponent userInfo={userInfo} state={state}></WalletComponent>
                            <AccountComponent userInfo={userInfo} state={state}></AccountComponent>
                            
                        </>
                    )
                }
            </Body>
            <div style={{position: 'fixed', bottom: '8.45vh', left: 0, width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', borderTop: '1.35vh solid #eae9e9'}}>
                <Amount>
                    <div style={{fontSize: '3.8vw'}}>금액입력</div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <PriceInput defaultValue="0" value={amount} onChange = {onChangeAmount} />
                        <div style={{fontSize: '3.8vw', marginLeft: 10}}>{state? "D-KRW" : "원"}</div>
                    </div>
                </Amount>
            </div>
            <ExRunButton onClick={onClickExchange}>
                교환하기
            </ExRunButton>
        </div>
    )
}

export { Exchange }

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
`
const HeaderText = styled.div`
    color: #000;
`
const CardChild = styled.div`
    width: 90vw;
    height: 14.31vh;
    padding-top: 3.5vh;
    padding-bottom: 3vh;
    border-top: 1px solid #dcdcdc;
    box-shadow: 1px 2px 6px 1px #bfcfea;
    border-radius: 4vw;
    margin-top: 4vw;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`
const Amount = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90vw;
    margin: 2vw 0;
`
const PriceInput = styled.input`
    border: 1px solid #cfcccc;
    border-radius: 5px;
    text-align: right;
    width: 50.9vw;
    height: 7.5vh;
    font-size: 4vw;
    padding-right: 20px;
`
const ExRunButton = styled.button`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 8.45vh;
    background-color: #00b2a7;
    border: none;
    font-size: 4.5vw;
    color: #ffffff;
`
const ExItem = styled.div`
    display: flex;
    justify-content: center;
    align-imtes: center;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 5px;
    width: 100px;
    color: #009ae8;
    margin-left: 20px;
    margin-right: 20px;
    background-color: #f0f0f0;
    box-shadow: 1px 2px 6px 1px #bfcfea;
`
const ExButton = styled.button`
    position: absolute;
    left: calc(50% - 20px);
    top: -10px;
    width: 40px;
    height: 20px;
    background: #ffffff;
    border: 1px solid #888888;
    border-radius: 3px;
    outline: none;
`