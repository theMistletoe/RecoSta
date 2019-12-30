import React from "react";
import styled from 'styled-components';

const InnerFooter = styled.footer`
    position: fixed; /* ヘッダーを固定する */
    bottom: 0; /* 上部から配置の基準位置を決める */
    left: 0; /* 左から配置の基準位置を決める */
    height: 30px; /* フッターの高さを指定する */
    width: 100%; /* ヘッダーの横幅を指定する */
    background-color: #006655;
    color: ghostwhite;
`;

export default class Header extends React.Component {
    render() {
        return (
            <InnerFooter>
                @2019 <a href="https://github.com/theMistletoe">theMistletoe</a> All Right Reserved.
            </InnerFooter>
        );
    }
}