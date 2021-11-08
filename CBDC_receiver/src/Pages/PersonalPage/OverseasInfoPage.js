import React, { useEffect, useState } from "react"
import styled from 'styled-components'
import { dbService } from "../../fbase"
import { history } from "../../_helpers"

const OverseasInfoPage = () => {
    const [txs, setTxs] = useState([])

    const getOverseasHistory = async(e) => {
        try {
            var txSnapshot = await dbService
                .collection(`OverseasInfo`)
                .where('status', '==', 'send')
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

    const logoStyle = {
        height: '8vh',
        width: '50vw',
        marginRight: '3vw'
    }

    return (
        <div>
            <Header>
                <img src={"/images/bangkok_bank.png"} style={logoStyle}/>
            </Header>
            <Mline/>
            <div style={{width:'100%', height:'10vh', backgroundColor:'white', fontSize:'4vw', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', fontWeight:'600'}}>
                CBDC International Transfer<br/>Transactions
            </div>
            <Body>
                <List>
                    <ListBody>
                        {
                            txs.map((tx,index)=> (
                                <ListItem key={index}>
                                    <ListItemLeft>
                                        <Name>{tx.sender_name} {'>'}</Name>
                                        <Amount>{tx.amount} D-THB</Amount>
                                    </ListItemLeft>
                                    <ListItemRight>
                                        <Time>{tx.transaction_date}</Time>
                                        <StatusButton onClick={()=>{
                                            history.push({
                                                pathname: '/detail',
                                                state: {txId: tx.id}
                                             })}}>Transfer<br/>Complete</StatusButton>
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

export { OverseasInfoPage } 

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
const Mline = styled.div`
    height: 1.4px;
    width: 100%;
    background-color: #e2e2e2;
`
const Body = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: #ffffff; 
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
    text-align: center;
    cursor: pointer;
`