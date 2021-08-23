import React, { Component } from 'react'
import styled from 'styled-components';

class Sidebar extends Component {
    
    render() {
        return (
            <aside className="aside-container left side-menu">
                <div className="aside-inner">
                    <Title>{this.props.bankName}</Title>
                </div>
            </aside>
        )
    }
}

export default Sidebar;

const Title = styled.h3`
    padding: 10px;
    color: red;
    text-align: center;
`