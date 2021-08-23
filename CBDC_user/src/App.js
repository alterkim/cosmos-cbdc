import React, { useEffect, useState } from 'react'
import { Router, Route, Switch, Redirect } from 'react-router-dom'

import { history } from './_helpers'

import { HomePage } from './Pages/HomePage'
import { PersonalPage, 
        SaveAccountPage, 
        SaveDealPage,
        CBDCDealCommonPage,
        CBDCDealDisasterExtinctPage,
        CBDCDealDisasterReductionPage,
        CBDCPage,
        TransferPage,
        ExchangePage,
        PaymentPage,
        PaymentQR,
    } from './Pages/PersonalPage'

import { 
        AffiliatePage,
        ACBDCPage,
        ASaveAccountPage,
        ASaveDealPage,
        ACBDCDealPage,
        AExchangePage,
        ATransferPage
    } from './Pages/AffiliatePage'
import { dbService } from './fbase'
import { Exchange } from './Pages/Components/Exchange'

function App() {
    const [userInfo,setUserInfo] = useState([])
    const [affiliateInfo,setAfilliateInfo] = useState([])

    const affiliateUid = "73lQmKhayChBID8CO7RL"
    const userUid = "kvIj9IcrYkp0hlJK2NrZ"


    //request 횟수 체크
    useEffect(()=>{
        const fetchData = async() =>{
            try{
                const reponse = await dbService
                    .collection("UserInfo")
                    .doc(userUid)
                    .get();
                let data = []
                if(reponse.exists){
                    data = reponse.data()
                    data["uid"] = userUid
                }
                setUserInfo(data)
            }catch(error){
                console.log(error)
                console.log("Getting userInfo Error in App.js")
            }

            try{
                const reponse = await dbService
                    .collection("UserInfo")
                    .doc(affiliateUid)
                    .get();
                let data = []
                if(reponse.exists){
                    data = reponse.data()
                    data["uid"] = affiliateUid
                }
                setAfilliateInfo(data)
            }catch(error){
                console.log(error)
                console.log("Getting affiliateInfo Error in App.js")
            }
        }
        fetchData()        
    },[])
    return (
        <div className="jumbotron">
            <div className="container">
                <div className="col-md-8 offset-md-2">
                    {alert.message &&
                        <div className={`alert ${alert.type}`}>{alert.message}</div>
                    }
                    <Router history={history}>
                        <Switch>
                            <Route exact path="/" component={HomePage} />
                            <Route path="/personal/deal/save" render ={()=><SaveDealPage userInfo={userInfo}/>} />
                            <Route path="/personal/deal/cbdc/common" render ={()=><CBDCDealCommonPage userInfo={userInfo}/>}/>
                            <Route path="/personal/deal/cbdc/disaster/Extinct" render ={()=><CBDCDealDisasterExtinctPage userInfo={userInfo}/>} />
                            <Route path="/personal/deal/cbdc/disaster/Reduction" render ={()=><CBDCDealDisasterReductionPage userInfo={userInfo}/>} />
                            <Route path="/personal/save" render ={()=><SaveAccountPage userInfo={userInfo}/>} />
                            <Route path="/personal/cbdc" render ={()=><CBDCPage userInfo={userInfo}/>} />
                            <Route path="/personal/exchange" render ={()=><ExchangePage userInfo={userInfo}/>} />

                            <Route path="/personal/transfer" render ={()=><TransferPage userInfo={userInfo}/>}/>
                            <Route path="/personal/payment/read-qr" render ={()=><PaymentQR userInfo={userInfo}/>} />
                            <Route path="/personal/payment" render ={()=><PaymentPage userInfo={userInfo} affiliateInfo={affiliateInfo}/>} />
                            <Route path="/personal" render ={()=><PersonalPage userInfo={userInfo}/>} />
                            
                            <Route path="/affiliate/deal/save" render ={()=><ASaveDealPage affiliateInfo={affiliateInfo}/>} />
                            <Route path="/affiliate/deal/cbdc" render ={()=><ACBDCDealPage affiliateInfo={affiliateInfo}/>}  />
                            <Route path="/affiliate/save" render ={()=><ASaveAccountPage affiliateInfo={affiliateInfo}/>}  />
                            <Route path="/affiliate/cbdc" render ={()=><ACBDCPage affiliateInfo={affiliateInfo}/>}/>
                            <Route path="/affiliate/exchange" render ={()=><AExchangePage affiliateInfo={affiliateInfo}/>} />
                            <Route path="/affiliate/transfer" render ={()=><ATransferPage affiliateInfo={affiliateInfo}/>} />
                            <Route path="/affiliate" render ={()=><AffiliatePage affiliateInfo={affiliateInfo}/>} />
                            
                            <Redirect from="*" to="/" />
                        </Switch>
                    </Router>
                </div>
            </div>
        </div>
    );
}

export default App;