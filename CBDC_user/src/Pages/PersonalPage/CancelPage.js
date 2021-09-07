import { faChevronLeft, faHome, faChevronDown, faChevronUp, faSearch, faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, {userEffect, useState} from "react"
import styled from "styled-components"
import { history } from '../../_helpers'
import { dbService } from "../../fbase"

const CancelPage = ({userInfo}) => {
    const [txs, setTxs] = useState([])
    const getUserTxHistory = async(e) => {
        try {
            var userQuerySnapshot = await dbService
                .collection(`TxInfo`)
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

    userEffect(()=> {
        getUserTxHistory()
    },[userInfo, setTxs])

    return(
        <div>
            <Header>
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw', cursor:'pointer'}}
                    onClick={()=> history.pushState('/personal/deal/cbdc')}
                />
                <HeaderText>결제취소</HeaderText>
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

            </Body>
        </div>
    )
}

export { CancelPage }

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