import React from 'react'

import Header from './Header'
import Sidebar from './Sidebar'

const Base = props => (
    <div className="wrapper">
        <Header bankName={props.bankName} history={props.history}/>
        {/* <Sidebar bankName={props.bankName}/> */}
        <section className="section-container">
            { props.children }
        </section>
        {/* <Footer /> */}
    </div>
)

export default Base;