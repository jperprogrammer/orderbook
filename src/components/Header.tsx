import React from 'react'
import styled from 'styled-components'

const Header = () => {
    return (
        <HeaderContainer>
            <p className="title">Order Book</p>
            <div className="spread">
                <p className="spread_title">Spread:</p>
                <p className="spread_value">17.0 (0.05%)</p>
            </div>
        </HeaderContainer>
    )
}

export default Header

const HeaderContainer = styled.div`
    display: flex;
    width: 100%;
    height: 70px;
    border-bottom: 2px solid #6b6a68;
    justify-content: center;
    align-items: center;

    .title {
        position: absolute;
        left: 0;
        color: white;
        font-size: 25px;
        margin-left: 20px;
    }
    .spread {
        display: flex;
        color: #6b6a68;
        font-size: 20px;
    }
    .spread_title {
        margin-left: 10px;
    }
    .spread_value {
        margin-left: 10px;
    }

    @media screen and (max-width: 768px) {
        .spread {
            display: none;
        }
    }
`;