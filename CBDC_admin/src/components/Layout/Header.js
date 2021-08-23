import React, { useState } from 'react'
import styled from 'styled-components';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as settingsAction from '../../store/settings'
import { dbService } from '../../fbase';
import {USER_ID,AFFILIATE_ID} from '../../constants/Constants'

const Header = ({bankName,history}) =>{
    const [page,setPage] = useState(true)
    const onClickPage = ()=>{
        if(page){
            history.push('/distribution')
        }else{
            history.push('/home')
        }
        setPage(!page)
    }

    const onClickGear = async()=>{
        //initialize DB
        await dbService
            .collection(`IssueInfo`)
            .get().then(res => {
                res.forEach(element => {
                  element.ref.delete();
                });
              });
        
        await dbService
            .collection(`TxInfo`)
            .get().then(res => {
                res.forEach(element => {
                element.ref.delete();
                });
            });
        
        await dbService
            .collection(`UserInfo`)
            .doc(USER_ID)
            .update({
                common_cbdc_balance : 0,
                extinct_cbdc_balance : 0,
                fiat_balance : 1000000,
                reduce_cbdc_balance : 0
            })
        
        await dbService
            .collection(`UserInfo`)
            .doc(AFFILIATE_ID)
            .update({
                common_cbdc_balance : 1000000,
                fiat_balance : 1000000,
            })
        
        
    }
    return (
        <header className="topnavbar-wrapper">
            <div className="w-100">
                <h2 style={{color:'skyblue'}}>CBDC 관리 시스템</h2>
                <Menus>
                    <div className="left-menu">
                        <MenuItem style={{color:'skyblue'}}>Central Bank Digital Currency</MenuItem>
                    </div>
                    <div className="right-menu">
                        <MenuItem>{bankName}</MenuItem>
                        <MenuItem>
                            <i onClick={onClickPage} className="fa fa-sign-out"></i>
                        </MenuItem>
                        <MenuItem>
                            <i onClick={onClickGear}className="fa fa-gear"></i>
                        </MenuItem>
                    </div>
                </Menus>
            </div>
        </header>
    )
}


const mapStateToProps = state => ({ settings: state.settings });
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ ...settingsAction }, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);

const Menus = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const MenuItem = styled.h5`
    padding: 0 10px;
    cursor: pointer;
`