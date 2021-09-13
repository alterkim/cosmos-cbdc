import { faChevronLeft, faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, {useEffect, useState} from "react"
import styled from "styled-components"
import { history } from '../../_helpers'
import { dbService, firebaseInstance } from "../../fbase"
import { useLocation } from 'react-router'
import GetDatetime from '../../_helpers/GetDatetime'
import TokenTransfer from '../../_helpers/TokenTransfer'
import { ADDRESS_AFILIATE, ADDRESS_ESCROW, ADDRESS_USER_1 } from '../../constants/Accounts'

const ACancelPage = ({userInfo, affiliateInfo}) => {
    const [txs, setTxs] = useState([])
    const txId = useLocation().state.txId
    const getUserTxHistory = async() => {
        try {
            const userQuerySnapshot = await dbService
                .collection(`TxInfo`)
                .where('tx_id', '==', txId)
                .get()
            
            const txsArray = userQuerySnapshot.docs.map((doc=>({
                ...doc.data()
            })))
            setTxs(txsArray.filter(tx => tx.cbdc_type === "common" 
                && tx.sender_account ===userInfo.account))
        } catch(error) {
            console.log(error)
        }
    }

    useEffect(()=> {
        getUserTxHistory()
    },[userInfo,setTxs])

    const onClickRefuse = async(e) => {
        try {
            const refuseSnapshot = await dbService
                .collection(`TxInfo`)
                .where('tx_id', '==', txId)
                .get()
            
            await dbService.collection(`TxInfo`)
                .doc(refuseSnapshot.docs[0].id)
                .update({payment_cancel_progress : "결제취소거부"})
        } catch(error) {
            console.log(error)
        }
        history.push('/affiliate/deal/cbdc')
    }

    const onClickApprove = async(e) => {
        try {
            // Check time interval
            const timeInterval = Date.parse(GetDatetime()) - Date.parse(e.target.value)
            const refuseSnapshot = await dbService
                .collection(`TxInfo`)
                .where('tx_id', '==', txId)
                .get()

            var amount, cbdc_type, receiver_account, receiver_name, receiver_wallet, sender_account, sender_name, sender_wallet;
            txs.map((tx,index) => {
                amount = tx.amount
                cbdc_type = tx.cbdc_type
                receiver_account = tx.receiver_account
                receiver_name = tx.receiver_name
                receiver_wallet = tx.receiver_wallet
                sender_account = tx.sender_account
                sender_name = tx.sender_name
                sender_wallet = tx.sender_wallet
            })
            var randomNum = (Math.floor(Math.random()*(10000-1)) + 1)+'';
            while(randomNum.length < 5){
                randomNum = '0'+randomNum
            }
            

            if (timeInterval < 259200000) {
                // Before 3 days
                TokenTransfer(amount, ADDRESS_ESCROW, ADDRESS_USER_1)
            } else {
                // After 3 days
                TokenTransfer(amount, ADDRESS_AFILIATE, ADDRESS_USER_1)
            }
            await dbService.collection(`TxInfo`)
                .add({
                    ["amount"] : amount,
                    ["cbdc_type"] : cbdc_type,
                    ["receiver_account"] : receiver_account,
                    ["receiver_name"] : receiver_name,
                    ["receiver_wallet"] :receiver_wallet,
                    ["sender_account"] : sender_account,
                    ["sender_name"] : sender_name,
                    ["sender_wallet"] : sender_wallet,
                    ["transaction_date"] : GetDatetime(),
                    ["transaction_type"] : "결제취소",
                    ["tx_id"] : "TX2021-" + randomNum
                })

            await dbService.collection(`TxInfo`)
                .doc(refuseSnapshot.docs[0].id)
                .update({payment_cancel_progress : "결제취소승인"})
            
            var user_cbdc_balance = {}
            user_cbdc_balance["common_cbdc_balance"] = firebaseInstance.firestore.FieldValue.increment(amount)
            await dbService
                .doc(`UserInfo/${userInfo.uid}`)
                .update(user_cbdc_balance)
                
            var affiliate_cbdc_balance ={}
            affiliate_cbdc_balance["common_cbdc_balance"] = firebaseInstance.firestore.FieldValue.increment(-amount)
            await dbService
                .doc(`UserInfo/${affiliateInfo.uid}`)
                .update(affiliate_cbdc_balance)
        } catch(error) {
            console.log(error)
        }
        history.push('/affiliate/deal/cbdc')
    }

    return(
        <div>
            <Header>
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw', cursor:'pointer'}}
                    onClick={()=> history.push('/affiliate/deal/cbdc')}
                />
                <HeaderText>결제취소 요청</HeaderText>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faHome} style={{color: "#000", fontSize: '4vw', marginRight: '3vw'}}/>
                    <Dbutton
                        style={{
                            marginRight: '4vw'
                        }}
                        onClick={() => history.push('/personal/CBDC')}
                    >
                        D
                    </Dbutton>
                </div>
            </Header>
            <Body>
                <CardChild>
                    <div style={{display: 'flex', flexDirection: 'column', padding: '0 4vw'}}>
                        <div style={{marginTop: '2vw', color: '#000', fontSize:'3.73vw'}}>
                        <img 
                            src={"/images/hana_logo.png"} 
                            alt="logo"
                            style={{
                                height:20,
                                marginRight:10
                            }}
                        />거래내역-상세</div>
                        {txs.map((tx,index)=>(
                            <>
                            <span style={{marginLeft:20, marginBottom:5, marginTop:5}}>결제자: {tx.sender_name}</span>
                            <span style={{marginLeft:20, marginBottom:5}}>결제처: {tx.receiver_name}</span>
                            <span style={{marginLeft:20, marginBottom:5}}>결제시간: {tx.transaction_date}</span>
                            <div style={{marginTop: '1vw', display: 'flex', justifyContent: 'flex-end', position: 'relative'}}>
                                <div style={{fontSize: '6vw'}}>{tx.amount&&tx.amount.toLocaleString()} <span style={{fontSize: '4vw'}}>D-KRW</span></div>
                            </div>
                            </>
                        ))}
                    </div>
                </CardChild>
                <div className="d-flex justify-content-center">
                    {txs.map((tx,index)=>(
                        <>
                            <RefuseButton style={{marginRight:20, marginTop:20, marginBottom: 20}} onClick={onClickRefuse}>거절</RefuseButton>
                            <ApproveButton  value={tx.transaction_date} onClick={onClickApprove}>승인</ApproveButton>
                        </>
                    ))}
                </div>
            </Body>
        </div>
    )
}

export {ACancelPage}

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
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`

const HeaderText = styled.div`
    color: #000;
`

const Dbutton = styled.button`
    color: #ffffff;
    background-color: #00b2a7;
    font-size: 3.73vw;
    font-weight: 600;
    width: 4.5vw;
    height: 4.5vw;
    border-radius: 2vw;
    border: none;
    text-align: center;
`
const CardChild = styled.div`
    width: 90vw;
    height: 12.31vh;
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
const RefuseButton = styled.button`
    color: #adacac;
    background-color: #ffffff;
    font-size: 3.73vw;
    font-weight: 600;
    width: 25vw;
    height: 8vw;
    border-radius: 2vw;
    border: none;
    text-align: center;
`
const ApproveButton = styled.button`
    color: #ffffff;
    background-color: #00b2a7;
    font-size: 3.73vw;
    font-weight: 600;
    width: 25vw;
    height: 8vw;
    border-radius: 2vw;
    border: none;
    text-align: center;
`