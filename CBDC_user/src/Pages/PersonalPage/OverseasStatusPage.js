import { faChevronLeft, faHome, faBars, faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { history } from "../../_helpers"
import React, {useEffect, useState} from "react"
import styled from "styled-components"
import { dbService } from "../../fbase"

const OverseasStatusPage = ({userInfo}) => {
    const [txs, setTxs] = useState([])

    const getOverseasHistory = async(e) => {
        try {
            var txSnapshot = await dbService
                .collection(`OverseasInfo`)
                .get()
            
            const txsArray = txSnapshot.docs.map((doc)=>({
                ...doc.data()
            })).sort(function(a,b){
                if(a.transaction_date > b.transaction_date){
                    return -1;
                }
                if(a.transaction_date < b.transaction_date){
                    return 1;
                }
                return 0;
            })
            setTxs(txsArray)
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
                    onClick={() => history.push('/personal/overseastransfer')}/>
                <HeaderText style={{marginLeft: 40}}>CBDC 해외송금 진행상태 조회</HeaderText>
                <div>
                    <FontAwesomeIcon icon={faHome} style={{color: "#000", fontSize: '4vw', marginRight: 15}}/>
                    <FontAwesomeIcon icon={faBars} style={{color: "#000", fontSize: '4vw', marginRight: '5vw'}}/>
                </div>
            </Header>
            <Body>
                <div style={{display:'flex', flexDirection: 'column', justifyContent:'center', width: '100%', marginTop: '2vh', marginBottom: '4vh'}}>
                    <div style={{margin: 'auto', fontSize: '3.4vw'}}>3개월 이내의 거래 내역만 조회 가능합니다.</div>
                    <div style={{display: 'flex', justifyContent:'space-evenly', marginTop: '2vh'}}>
                        <MonthButton>1개월</MonthButton>
                        <MonthButton style={{backgroundColor: '#00b2a7', color: 'white'}}>2개월</MonthButton>
                        <MonthButton>3개월</MonthButton>
                    </div>
                </div>

                <List>
                    <ListBody>
                        {
                            txs.map((tx,index)=> (
                                <ListItem key={index}>
                                    <ListItemLeft>
                                        <Name>{tx.receiver_fname} {tx.receiver_lname} {'>'} </Name>
                                        <Amount>{tx.amount} D-THB</Amount>
                                    </ListItemLeft>
                                    <ListItemRight>
                                        <Time>{tx.transaction_date}</Time>
                                        <StatusButton>송금완료</StatusButton>
                                    </ListItemRight>
                                </ListItem>
                            ))
                        }
                    </ListBody>
                </List>
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
    background-color: #ffffff; 
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
const List = styled.div`
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    border-top: 1px solid #efefef;
    width: 100vw;
`
const ListBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const ListItem = styled.div`
    display: flex;
    width: 100vw;
    height: 9.86vh;
    padding-top: 1.6vh;
    padding-bottom: 1.6vh;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #efefef;
`
const ListItemLeft = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-left: 4vw;
`
const ListItemRight = styled.div`
    color: #00b2a7;
    font-size: 3.8vw;
    font-weight: 400;
    flex-direction: column;
    display: flex;
    align-items: center;
`
const Name = styled.div`
    color: #aaaaaa;
    font-size: 2.67vw;
`
const Time = styled.div`
    color: #aaaaaa;
    font-size: 3vw;
    margin-right: 3vw;
`
const Amount = styled.div`
    margin-top: 10px;
    color: #000000;
    font-size: 4.5vw;
    font-weight: 600;
`
const StatusButton = styled.div`
    background-color: #00b2a7;
    color: white;
    padding: 0.7vh 4vw;
    border-radius: 10px;
    margin-right: 4vw;
    font-weight: 500;
    font-size: 3.5vw;
    margin-top: 1.5vh;
`