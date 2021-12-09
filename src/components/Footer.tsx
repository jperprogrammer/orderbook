import React from 'react'
import styled from 'styled-components'
import Subscribe from '../api/Subscribe'
import UnSubscribe from '../api/UnSubscribe'

const Footer = () => {
    const handleClick = () => {
        localStorage.setItem("productId", 'PI_ETHUSD')
        UnSubscribe('PI_ETHUSD')
    }
    return (
        <FooterContainer>
            <FeedButton onClick={() => handleClick()}>Toggle Feed</FeedButton>
        </FooterContainer>
    )
}

export default Footer

const FooterContainer = styled.div`
    position: absolute;
    width: 100%;
    height: 100px;
    bottom: 0;
    text-align: center;
    margin: 1 auto;
`;

const FeedButton = styled.button`
    margin-top: 20px;
    color: white;
    font-size: 15px;
    border-radius: 5px;
    background-color: #782cab;
    border: none;
    padding: 10px 20px 10px 20px;
`;


