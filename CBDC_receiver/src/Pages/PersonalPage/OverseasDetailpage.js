import React, { useEffect, useState } from "react"
import styled from 'styled-components'
import { dbService } from "../../fbase"
import { history } from "../../_helpers"
import { useLocation } from "react-router"


const OverseasDeatailPage = () => {
    const location = useLocation()
    const [tx, setTx] = useState({})
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

    const logoStyle = {
        height: '8vh',
        width: '50vw',
        marginRight: '3vw'
    }
    const countryStyle = {
        height:'20px',
        width:'30px',
        marginLeft:'2vw',
        overflow:'hidden',
        objectFit: 'cover'
    }

    return(
        <div>
            <Header>
                <img src={"/images/bangkok_bank.png"} style={logoStyle}/>
            </Header>
            <Mline/>
            <div style={{width:'100%', height:'10vh', backgroundColor:'white', fontSize:'4vw', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', fontWeight:'600'}}>
                CBDC International Transfer<br/>Transactions
            </div>
            <Body>
                <CardChild>
                    <Time>{tx.transaction_date}</Time>
                    <div style={{marginTop: "1vh", display: 'flex', justifyContent:'space-between', alignItems: 'center', width: '100%', height: 40, borderBottom: '2px solid #d3d3d3'}}>
                        <div style={{fontSize: '3.3vw', marginLeft: '4vw', color:'black'}}>Wallet Address</div>
                        <div style={{fontSize:'3.4vw', marginRight:'6vw', fontWeight: '400'}}>{tx.receiver_address}</div>
                    </div>
                    <div style={{marginTop: "1vh", display: 'flex', justifyContent:'space-between', alignItems: 'center', width: '100%', height: 40, borderBottom: '2px solid #d3d3d3'}}>
                        <div style={{fontSize: '3.3vw', marginLeft: '4vw', color:'black'}}>Amount</div>
                        <div style={{fontSize:'3.4vw', marginRight:'6vw', fontWeight: '400'}}>{tx.amount} D-THB</div>
                    </div>
                </CardChild>
                <div style={{marginTop: "4vh", display: 'flex', alignItems: 'center', width: '100%', height: 40, borderBottom: '2px solid gray'}}>
                        <div style={{fontSize:'3.5vw', marginLeft: '4vw', fontWeight: '600'}}>Applicant</div>
                        <div style={{fontSize:'3.4vw', marginLeft: '60%', fontWeight: '400'}}>{tx.sender_country}</div>
                        <img src={"/images/korea.png"} style={countryStyle}></img>
                </div>
                <div style={{marginTop: "1vh", display: 'flex', justifyContent:'space-between' , alignItems: 'center', width: '100%', height: 40, borderBottom: '2px solid #d3d3d3'}}>
                        <div style={{fontSize: '3.3vw', marginLeft: '4vw', color:'gray'}}>Name</div>
                        <div style={{fontSize:'3.4vw', marginRight:'6vw', fontWeight: '400'}}>{tx.sender_name}</div>
                    </div>
                    <div style={{marginTop: "1vh", display: 'flex', justifyContent:'space-between', alignItems: 'center', width: '100%', height: 40, borderBottom: '2px solid #d3d3d3'}}>
                        <div style={{fontSize: '3.3vw', marginLeft: '4vw', color:'gray'}}>Bank</div>
                        <div style={{fontSize:'3.4vw', marginRight:'6vw', fontWeight: '400'}}>{tx.sender_bank}</div>
                    </div>
                    <div style={{marginTop: "1vh", display: 'flex', justifyContent:'space-between', alignItems: 'center', width: '100%', height: 40, borderBottom: '2px solid #d3d3d3'}}>
                        <div style={{fontSize: '3.3vw', marginLeft: '4vw', color:'gray'}}>Date</div>
                        <div style={{fontSize:'3.4vw', marginRight:'6vw', fontWeight: '400'}}>{tx.transaction_date}</div>
                    </div>
            </Body>

        </div>
    )
}

export { OverseasDeatailPage }

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
const CardChild = styled.div`
    background-color: #f8f8f8;
    height: 12.31vh;
    padding-top: 2vh;
    padding-bottom: 3vh;
    border-top: 1px solid #dcdcdc;
    box-shadow: 1px 2px 6px 1px #bfcfea;
    border-radius: 4vw;
    margin-top: 4vw;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 90vw;
`
const Time = styled.div`
    color: #aaaaaa;
    font-size: 3vw;
    margin-left: 2vw;
`