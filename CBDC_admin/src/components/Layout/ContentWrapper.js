import React from 'react'

const ContentWrapper = props => (
    <div className="content-wrapper">
        {props.unwrap ?
            (<div className="unwrap">{props.children}</div>)
            :
            (props.children)
        }
    </div>
)

ContentWrapper.defaultProps = {
    unwrap: false
}

export default ContentWrapper;