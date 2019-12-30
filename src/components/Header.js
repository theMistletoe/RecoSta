import React from "react";
import logo from "../images/logo.png"
import styled from 'styled-components';

const Image = styled.img`
    width: 56px;
    height: 56px;
`;

const InnerHeader = styled.header`
    position: fixed; /* ヘッダーを固定する */
    top: 0; /* 上部から配置の基準位置を決める */
    left: 0; /* 左から配置の基準位置を決める */
    width: 100%; /* ヘッダーの横幅を指定する */
    background-color: #006655;
    height: 56px;
`;

export default class Header extends React.Component {
    render() {
        return (
            <InnerHeader>
                <Image src={logo} alt="Logo"></Image>
            </InnerHeader>
        );
    }
}