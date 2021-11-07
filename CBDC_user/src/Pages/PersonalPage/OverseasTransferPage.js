import { faChevronLeft, faHome, faBars, faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { history } from "../../_helpers"
import React, {useEffect, useState} from "react"
import styled from "styled-components"
import { dbService, firebaseInstance } from "../../fbase"
import { useLocation } from "react-router"
import TokenCosmosTransfer from "../../_helpers/TokenCosmosTransfer"
import { ADDRESS_BANGKOK_BANK, ADDRESS_HANA_BANK, ADDRESS_USER_1, ADDRESS_USER_B } from "../../constants/Accounts"
import TokenLineTransfer from "../../_helpers/TokenLineTransfer"
import { KEY_BANGKOKBANK, KEY_CITIBANK, KEY_HANABANK, KEY_JPMORGAN } from "../../constants/Keys"

const Caver = require('caver-js')
const caver = new Caver('http://141.223.181.204:8551/')

const OverseasTransferPage = ({userInfo}) => {
    const location = useLocation()
    const [transfer, setTransfer] = useState(false)
    const [tx, setTx] = useState({})
    const [confirm, setConfirm] = useState(true)

    const key_jpmorgan = caver.wallet.keyring.createFromPrivateKey(KEY_JPMORGAN)
    const key_hanabank = caver.wallet.keyring.createFromPrivateKey(KEY_HANABANK)
    const key_bangkokbank = caver.wallet.keyring.createFromPrivateKey(KEY_BANGKOKBANK)
    const key_citibank = caver.wallet.keyring.createFromPrivateKey(KEY_CITIBANK)

    const countryStyle = {
        height:'20px',
        width:'30px',
        marginLeft:'2vw',
        overflow:'hidden',
        objectFit: 'cover'
    }

    const updateCrossTxInfo = async(_amount, _blockNumber, _chain, _receiver, _sender,) => {
        await dbService
            .collection(`CrossTxInfo`)
            .add({
                amount: _amount,
                blocknum: _blockNumber,
                chain_name: _chain,
                receiver_wallet: _receiver,
                sender_wallet: _sender
            })
    }

    const onClickTransfer = async(e) => {
        const txId = location.state.txId
        const krw_amount = parseInt(tx.krw_amount.replace(/,/g,""))
        const usd_amount = (krw_amount * 0.001).toFixed(3)
        const thb_amount = parseInt(tx.amount.replace(/,/g,""))

        // setConfirm(true)
        // 1. User A KRW-C Wallet -> 하나은행 KRW-C Wallet
        try {
            const blockNumber = await TokenCosmosTransfer(krw_amount, ADDRESS_USER_1, ADDRESS_HANA_BANK)
            updateCrossTxInfo(krw_amount, blockNumber, "cosmos", ADDRESS_HANA_BANK, ADDRESS_USER_1)
        } catch(error) {
            console.log(error)
            // setConfirm(false)
        }
        try {
            if(confirm){
                await dbService
                    .collection(`UserInfo`)
                    .doc(userInfo.uid)
                    .update({
                        common_cbdc_balance: firebaseInstance.firestore.FieldValue.increment(-krw_amount)
                    })
            }
        } catch(error) {
            console.log(error)
            // setConfirm(false)
        }

        // Status Update
        try {
            const overseasSnapshot = await dbService
                .collection(`OverseasInfo`)
                .where('id', '==', txId)
                .get()
        
            await dbService.collection(`OverseasInfo`)
                .doc(overseasSnapshot.docs[0].id)
                .update({
                    status: 'send'
            })

            setTransfer(true)
        } catch(error) {
            console.log(error)
        }
        
        // 2. 하나은행 KRW-C Wallet -> 하나은행 KRW Account
        try {
            if(confirm){
                await dbService
                    .collection(`BankInfo`)
                    .doc("Hana Bank")
                    .update({
                        krw_amount: firebaseInstance.firestore.FieldValue.increment(krw_amount)
                    })
            }
        } catch(error) {
            console.log(error)
            // setConfirm(false)
        }

        // 3. 하나은행 KRW Account -> 하나은행 USD Account
        try {
            if(confirm){
                await dbService
                    .collection(`BankInfo`)
                    .doc("Hana Bank")
                    .update({
                        krw_amount: firebaseInstance.firestore.FieldValue.increment(-krw_amount),
                        usd_amount: firebaseInstance.firestore.FieldValue.increment(usd_amount)
                    })
                }
        } catch(error) {
            console.log(error)
            // setConfirm(false)
        }

        // 4. 하나은행 USD Account -> 하나은행 JP Morgan USD Account
        try {
            if(confirm){
                await dbService
                    .collection(`BankInfo`)
                    .doc("Hana Bank")
                    .update({
                        usd_amount: firebaseInstance.firestore.FieldValue.increment(-usd_amount),
                        jpmorgan_amount: firebaseInstance.firestore.FieldValue.increment(usd_amount)
                    })
                }
        } catch(error) {
            console.log(error)
            // setConfirm(false)
        }

        // 5. 하나은행 JP Morgan USD Account -> JP Morgan USD-C Wallet 이체 확인 && 6. JP Morgan USD-C Wallet -> 하나은행 USD-C Wallet
        try {
            if(confirm) {
                const TokenKlaytnTransfer1 = caver.transaction.valueTransfer.create({
                    from: key_jpmorgan.address,
                    to: key_hanabank.address,
                    value: caver.utils.toPeb(usd_amount, 'kpeb'),
                    gas: 25000,
                })

                const signed1 = await caver.rpc.klay.signTransaction(TokenKlaytnTransfer1)
                const raw1 = await signed1.raw
                const receipt1 = await caver.rpc.klay.sendRawTransaction(raw1)
                const blockNumber = await receipt1.blockNumber
                const sender = await receipt1.from
                const receiver = await receipt1.to
                updateCrossTxInfo(usd_amount, parseInt(blockNumber), "klaytn", receiver, sender)
            }
        } catch(error) {
            console.log(error)
            // setConfirm(false)
        }

        // 7. 하나은행 USD-C Wallet -> 방콕은행 USD-C Wallet
        try {
            if(confirm) {
                const TokenKlaytnTransfer2 = caver.transaction.valueTransfer.create({
                    from: key_hanabank.address,
                    to: key_bangkokbank.address,
                    value: caver.utils.toPeb(usd_amount, 'kpeb'),
                    gas: 25000,
                })

                const signed2 = await caver.rpc.klay.signTransaction(TokenKlaytnTransfer2)
                const raw2 = await signed2.raw
                const receipt2 = await caver.rpc.klay.sendRawTransaction(raw2)
                const blockNumber = await receipt2.blockNumber
                const sender = await receipt2.from
                const receiver = await receipt2.to
                updateCrossTxInfo(usd_amount, parseInt(blockNumber), "klaytn", receiver, sender)
            }
        } catch(error) {
            console.log(error)
            // setConfirm(false)
        }

        // 8. 방콕은행 USD-C Wallet -> Citibank USD-C Wallet
        try {
            if(confirm) {
                const TokenKlaytnTransfer3 = caver.transaction.valueTransfer.create({
                    from: key_bangkokbank.address,
                    to: key_citibank.address,
                    value: caver.utils.toPeb(usd_amount, 'kpeb'),
                    gas: 25000,
                })

                const signed3 = await caver.rpc.klay.signTransaction(TokenKlaytnTransfer3)
                const raw3 = await signed3.raw
                const receipt3 = await caver.rpc.klay.sendRawTransaction(raw3)
                const blockNumber = await receipt3.blockNumber
                const sender = await receipt3.from
                const receiver = await receipt3.to
                updateCrossTxInfo(usd_amount, parseInt(blockNumber), "klaytn", receiver, sender)
            }
        } catch(error) {
            console.log(error)
            // setConfirm(false)
        }

        // 9. Citibank 이체 확인
        try {
            if(confirm) {
                await dbService
                    .collection(`BankInfo`)
                    .doc("Bangkok Bank")
                    .update({
                        citibank_amount: firebaseInstance.firestore.FieldValue.increment(usd_amount)
                    })
                // setConfirm(true)
            }
        } catch(error) {
            console.log(error)
            // setConfirm(false)
        }

        // 10. 방콕은행 Citibank USD Account -> 방콕은행 USD Account
        try {
            if (confirm) {
                await dbService
                    .collection(`BankInfo`)
                    .doc("Bangkok Bank")
                    .update({
                        citibank_amount: firebaseInstance.firestore.FieldValue.increment(-usd_amount),
                        usd_amount: firebaseInstance.firestore.FieldValue.increment(usd_amount)
                    })
                // setConfirm(true)
            }
        } catch(error) {
            console.log(error)
            // setConfirm(false)
        }

        // 11. 방콕은행 USD Account -> 방콕은행 THB Account
        try {
            if (confirm) {
                await dbService
                    .collection(`BankInfo`)
                    .doc("Bangkok Bank")
                    .update({
                        usd_amount: firebaseInstance.firestore.FieldValue.increment(-usd_amount),
                        thb_amount: firebaseInstance.firestore.FieldValue.increment(thb_amount)
                    })
                // setConfirm(true)
            }
        } catch(error) {
            console.log(error)
            // setConfirm(false)
        }

        // 12. 방콕은행 THB Account -> 방콕은행 THB-C Wallet
        try {
            if (confirm) {
                await dbService
                    .collection(`BankInfo`)
                    .doc("Bangkok Bank")
                    .update({
                        thb_amount: firebaseInstance.firestore.FieldValue.increment(-thb_amount)
                    })
                // setConfirm(true)
            }
        } catch(error) {
            console.log(error)
            // setConfirm(false)
        }

        // 13. 방콕은행 THB-C Wallet -> User B THB-C Wallet
        try {
            if (confirm) {
                const blockNumber = await TokenLineTransfer(thb_amount, ADDRESS_BANGKOK_BANK, ADDRESS_USER_B)
                updateCrossTxInfo(thb_amount, blockNumber, "line", ADDRESS_USER_B, ADDRESS_BANGKOK_BANK)
                // setConfirm(true)
            }
        } catch(error) {
            console.log(error)
        }
        // User B Info 만들어서 해당 balance 늘려야 하나?
    }

    const getOverseasHistory = async(e) => {
        const txId = location.state.txId
        try {
            const overseasSnapshot = await dbService
                .collection(`OverseasInfo`)
                .where('id', '==', txId)
                .get()
            
            setTx(overseasSnapshot.docs[0].data())
        } catch(error) {
            console.log(error)
        }
    }
    
    useEffect(()=> {
        getOverseasHistory()
    },[])

    return (
        <div>
            <Header>
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw', cursor: 'pointer'}}
                    onClick={() => history.push('/personal/overseasamount')}/>
                <HeaderText style={{marginLeft: 40}}>CBDC 해외송금</HeaderText>
                <div>
                    <FontAwesomeIcon icon={faHome} style={{color: "#000", fontSize: '4vw', marginRight: 15}}/>
                    <FontAwesomeIcon icon={faBars} style={{color: "#000", fontSize: '4vw', marginRight: '5vw'}}/>
                </div>
            </Header>
            {transfer == true?(
                <>
                    <FontAwesomeIcon icon={faCheckCircle} style={{color:'#00b2a7', fontSize:'6vw', display: 'flex', margin: 'auto'}}/>
                </>
            ):(
                <>
                </>
            )}
            <div style={{width:'100%', height:'6vh', backgroundColor:'white', fontSize:'4vw', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', fontWeight:'600'}}>
                {transfer?"신청 완료":"아래와 같이 송금됩니다."}
            </div>
            <Body>
                <div style={{marginTop: "1vh", display: 'flex', alignItems: 'center', width: '100%', height: 40}}>
                        <div style={{fontSize:'3.5vw', marginLeft: '10%', fontWeight: '600'}}>송금하실 금액</div>
                        <PriceOutput defaultValue="0" value={tx.amount} readOnly={true} style={{fontWeight:"600", color:'blue'}}/>
                        <div style={{fontSize:'3.5vw', textAlign: 'right', marginLeft: '2%', fontWeight:'600'}}>D-THB</div>
                </div>
                <CardChild>
                    <div style={{marginTop: "1vh", display: 'flex', alignItems: 'center', width: '100%', height: 40, borderBottom: '2px solid gray'}}>
                        <div style={{fontSize:'3.5vw', marginLeft: '4vw', fontWeight: '600'}}>받는 분</div>
                        <div style={{fontSize:'3.4vw', marginLeft: '60%', fontWeight: '400'}}>{tx.receiver_country}</div>
                        <img src={"/images/taiwan.png"} style={countryStyle}></img>
                    </div>
                    <div style={{marginTop: "1vh", display: 'flex', justifyContent:'space-between' , alignItems: 'center', width: '100%', height: 40, borderBottom: '2px solid #d3d3d3'}}>
                        <div style={{fontSize: '3.3vw', marginLeft: '4vw', color:'gray'}}>이름</div>
                        <div style={{fontSize:'3.4vw', marginRight:'6vw', fontWeight: '400'}}>{tx.receiver_fname} {tx.receiver_lname}</div>
                    </div>
                    <div style={{marginTop: "1vh", display: 'flex', justifyContent:'space-between', alignItems: 'center', width: '100%', height: 40, borderBottom: '2px solid #d3d3d3'}}>
                        <div style={{fontSize: '3.3vw', marginLeft: '4vw', color:'gray'}}>입금은행</div>
                        <div style={{fontSize:'3.4vw', marginRight:'6vw', fontWeight: '400'}}>{tx.receiver_bank}</div>
                    </div>
                    <div style={{marginTop: "1vh", display: 'flex', justifyContent:'space-between', alignItems: 'center', width: '100%', height: 40, borderBottom: '2px solid #d3d3d3'}}>
                        <div style={{fontSize: '3.3vw', marginLeft: '4vw', color:'gray'}}>입금지갑주소</div>
                        <div style={{fontSize:'3.4vw', marginRight:'6vw', fontWeight: '400'}}>{tx.receiver_address}</div>
                    </div>
                </CardChild>
                <CardChild>
                <div style={{marginTop: "1vh", display: 'flex', alignItems: 'center', width: '100%', height: 40, borderBottom: '2px solid gray'}}>
                        <div style={{fontSize:'3.5vw', marginLeft: '4vw', fontWeight: '600'}}>보내는 분</div>
                    </div>
                    <div style={{marginTop: "1vh", display: 'flex', justifyContent:'space-between' , alignItems: 'center', width: '100%', height: 40, borderBottom: '2px solid #d3d3d3'}}>
                        <div style={{fontSize: '3.3vw', marginLeft: '4vw', color:'gray'}}>이름</div>
                        <div style={{fontSize:'3.4vw', marginRight:'6vw', fontWeight: '400'}}>{tx.sender_name}</div>
                    </div>
                    <div style={{marginTop: "1vh", display: 'flex', justifyContent:'space-between', alignItems: 'center', width: '100%', height: 40, borderBottom: '2px solid #d3d3d3'}}>
                        <div style={{fontSize: '3.3vw', marginLeft: '4vw', color:'gray'}}>출금지갑주소</div>
                        <div style={{fontSize:'3.4vw', marginRight:'6vw', fontWeight: '400', marginBottom: '1vh'}}>{tx.sender_address}<br/>(cosmosTx92f6)</div>
                    </div>
                    <div style={{marginTop: "1vh", display: 'flex', justifyContent:'space-between', alignItems: 'center', width: '100%', height: 40, borderBottom: '2px solid #d3d3d3'}}>
                        <div style={{fontSize: '3.3vw', marginLeft: '4vw', color:'gray'}}>예상출금금액</div>
                        <div style={{fontSize:'3.4vw', marginRight:'6vw', fontWeight: '400'}}>{tx.krw_amount} D-KRW</div>
                    </div>
                </CardChild>
            </Body>
            {transfer == true?(
                <> 
                    <div style={{margin: 'auto', border:'1px solid gray', width: '60%',padding:'1vh', cursor: 'pointer', color: 'gray', textAlign: 'center', marginTop: '3vh', borderRadius:'8px', fontSize: '3.8vw'}}
                        onClick={() => history.push('/personal/overseasstatus')}>
                        송금진행상태 조회
                    </div>
                </>
            ):(
                <>
                    <ExRunButton onClick={onClickTransfer}>송금하기</ExRunButton>
                </>
            )}
            
        </div>
    )
}

export {OverseasTransferPage}

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
const PriceOutput = styled.input`
    text-align: right;
    width: 30%;
    height: 3vh;
    font-size: 3.5vw;
    border: 0;
    outline: 0;
    background-color: #f6f6f6;
    margin-left: 10%;
`
const CardChild = styled.div`
    width: 90vw;
    height: 20vh;
    padding-bottom: 2vh;
    border-top: 1px solid #dcdcdc;
    box-shadow: 1px 2px 6px 1px #bfcfea;
    border-radius: 4vw;
    margin-top: 4vw;
    margin-bottom: 4vw;
    font-weight: 600;
    display: flex;
    flex-direction: column;
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
    cursor: pointer;
    font-weight: 600;
`