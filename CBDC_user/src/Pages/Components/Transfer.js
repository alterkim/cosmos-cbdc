import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { history } from '../../_helpers';
import GetDatetime from "../../_helpers/GetDatetime";
import { dbService, firebaseInstance } from "../../fbase";
import TokenTransfer from "../../_helpers/TokenTransfer";

const Transfer = ({userInfo, returnPage}) => {
    const [inaddress, setInaddress] = useState(false)
    const [CBDCAmount, setCBDCAmount] = useState(0)
    const [walletShow,setWalletShow] = useState(false)
    const [senderAccount, setSenderAccount] = useState(userInfo.account)
    const [senderWallet,setSenderWallet] = useState(userInfo.wallet)

    const [receiverAccount, setReceiverAccount] = useState("")
    const [receiverWallet,setReceiverWallet] = useState("")
    const [receiverName, setReceiverName] = useState("")

    const [senderQuerySnapshot,setSenderQuerySnapshot] = useState([])
    const [receiverQuerySnapshot,setReceiverQuerySnapshot] = useState([])
    
    const [bankSrc,setBankSrc] = useState("")

    const onClickSender= async(e) => {
        try{
            // sender 세팅
            const senderSnapshot = await dbService
                .collection(`UserInfo`)
                .where('account','==',e.target.value)
                .get()
            const senderData = senderSnapshot.docs[0].data()
            setSenderAccount(senderData.account)
            setSenderWallet(senderData.wallet)
            setSenderQuerySnapshot(senderSnapshot)
            setWalletShow(true)
        }catch(error){
            console.log(error)
        }
        
    }

    const onChangeReceiverAccount=(e)=>{
        setReceiverAccount(e.target.value)
        setInaddress(false)
    }

    const onClickReceiverBank=async(e)=>{
        // receiver 세팅 
        const receiverBank = e.target.value
        setBankSrc("/images/"+receiverBank+".png")
        const receiverSnapshot = await dbService
                .collection(`UserInfo`)
                .where('account','==',receiverAccount)
                .get()
        
        if(!receiverSnapshot.empty){
            const receiverData = receiverSnapshot.docs[0].data()
            if(receiverData.bank ===receiverBank){
                setReceiverName(receiverData.name)
                
                setReceiverQuerySnapshot(receiverSnapshot)
                setReceiverWallet(receiverData.wallet)
                setInaddress(true)
            }else{
                setInaddress(false)
            }
        }
    }

    const onChangeCBDCAmount=(e) =>{
        var val = Number(e.target.value.replace(/\D/g, ''))
        setCBDCAmount(val.toLocaleString())
    }
    const transferClick= async(e) =>{
        try{
            
            if (senderQuerySnapshot.docs.length !== 0
                    && receiverQuerySnapshot.docs.length !== 0
                    && CBDCAmount !== "0"){
                //sender, receiver 업데이트

                var val = Number(CBDCAmount.replace(/\D/g, ''))
                const senderName = senderQuerySnapshot.docs[0].data().name
                const senderDocID = senderQuerySnapshot.docs[0].id 
                dbService
                    .doc(`UserInfo/${senderDocID}`)
                    .update({
                        common_cbdc_balance : firebaseInstance.firestore.FieldValue.increment(-val)
                    })

                const receiverDocID = receiverQuerySnapshot.docs[0].id
                dbService
                    .doc(`UserInfo/${receiverDocID}`)
                    .update({
                        common_cbdc_balance : firebaseInstance.firestore.FieldValue.increment(val)
                    })

                //Tx 생성
                var datetime = GetDatetime()
                await dbService
                    .collection(`TxInfo`)
                    .add({
                        sender_account : senderAccount,
                        sender_wallet : senderWallet,
                        sender_name : senderName,
                        receiver_name : receiverName,
                        receiver_wallet : receiverWallet,
                        receiver_account : receiverAccount,
                        amount : val,
                        transaction_type : "이체",
                        transaction_date : datetime,
                        cbdc_type : "common"
                    })
                

                TokenTransfer(val)

                history.push(returnPage)
                window.location.reload();

            }
        }catch(error){
            console.log(error)
        }
    }
    return (
        <div>
            <Header>
                <FontAwesomeIcon 
                    icon={faChevronLeft} 
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw',cursor:'pointer'}}
                    onClick={() => history.push(returnPage)}
                />
                <HeaderText>CBDC 이체하기</HeaderText>
                <div>
                    <FontAwesomeIcon icon={faTimes} style={{color: "#000", fontSize: '4vw', marginRight: '5vw'}}/>
                </div>
            </Header>
            <Body>
                <div style={{marginTop: '6.76vh', color: '#00b2a7', fontSize: '3.73vw', width: '90vw'}}>누구에게 이체하시겠어요?</div>
                <div style={{marginTop: "4vh", display: 'flex', alignItems: 'center', borderBottom: '1px solid #000', width: '90vw', height: 40}}>
                    <div style={{color: '#000', fontSize: '3.5vw'}}>출금지갑주소</div>
                    <select className="select"
                        onClick={onClickSender}
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
                        <option></option>
                        <option value={userInfo.account}>{userInfo.account}</option>
                        
                    </select>
                </div>
                {
                    walletShow &&(
                    <div style={{marginTop: '1.5vh', display: 'flex', alignItems: 'center', width: '90vw', height: 30}}>
                        <div style={{color: '#414141', 
                                    fontSize: '2.5vw', 
                                    color: '#8d8e8e',
                                    padding: 8,
                                    marginLeft: 'auto', 
                                    border: '1px solid #8d8e8e', 
                                    borderRadius: 10}}>{userInfo.wallet}</div>
                    </div>)
                }
                
                <div style={{marginTop: '4vh', borderBottom: '1px solid #000', display: 'flex', alignItems: 'center', width: '90vw', height: 40}}>
                    <div style={{color: '#000', fontSize: '3.5vw'}}>잔액</div>
                    <div style={{color: '#000', marginLeft: 'auto', fontSize: '3.5vw'}}>{userInfo.common_cbdc_balance&&userInfo.common_cbdc_balance.toLocaleString()}  D-KRW</div>
                </div>
                <div style={{marginTop: '6.76vh', borderBottom: '1px solid #000', display: 'flex', alignItems: 'center', width: '90vw', height: 40}}>
                    <div style={{color: '#000', fontSize: '3.5vw'}}>입금지갑주소</div>
                    <input onChange={onChangeReceiverAccount} 
                        style={{ textAlign:'right', marginLeft: 'auto', fontSize: '3.5vw'}}>
                    </input>
                </div>
                <div style={{marginTop: "6.76vh", display: 'flex', alignItems: 'center', borderBottom: '1px solid #888888', width: '90vw', height: 40}}>
                    <div style={{color: '#000', fontSize: '3.5vw'}}>입금은행</div>
                    <div style={{
                                    marginLeft :'auto',
                                    marginTop : 'auto'
                                }}>
                        {
                            bankSrc&&<img 
                                src={bankSrc} 
                                alt="logo"
                                style={{
                                    height: 30,
                                }}
                            />
                        }
                    </div>
                    <select 
                        onClick={onClickReceiverBank}
                        className="select"
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
                        <option value={"hana"}>하나은행</option>
                        <option value={"postech"}>포스텍은행</option>
                        <option value={"kaist"}>카이스트은행</option>
                    </select>
                </div>
                {
                (inaddress === true) && <>
                <div style={{marginTop: '8vh', color: '#00b2a7', fontSize: '3.73vw', width: '90vw'}}>아래와 같이 확인됩니다.</div>
                <div style={{marginTop: '2vh', borderBottom: '1px solid #000', display: 'flex', alignItems: 'center', width: '90vw', height: 40}}>
                    <div style={{color: '#000', fontSize: '3.5vw'}}>{receiverName}</div>
                    <div style={{color: '#414141', 
                                fontSize: '2.5vw', 
                                color: '#8d8e8e',
                                padding: 8,
                                marginLeft: 'auto', 
                                marginBottom: 10,
                                border: '1px solid #8d8e8e', 
                                borderRadius: 10}}>{receiverWallet}</div>
                    </div>
                </>}
            </Body>
            <div style={{position: 'fixed', bottom: '8.45vh', left: 0, width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', borderTop: '1.35vh solid #eae9e9'}}>
                <Amount>
                    <div style={{fontSize: '3.8vw'}}>금액입력</div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <PriceInput defaultValue="0" value={CBDCAmount} onChange={onChangeCBDCAmount}/>
                        <div style={{fontSize: '3.8vw', marginLeft: 10}}>D-KRW</div>
                    </div>
                </Amount>
            </div>
            <ExRunButton onClick={transferClick}>
                이체하기
            </ExRunButton>
        </div>
    )
}

export { Transfer }

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