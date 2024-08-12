
import React from "react";
import { Tabs } from "antd";
import AssetTransfer from "./transfer";
import AssetCreate from "./create";
import AssetMint from "./mint";
import AssetBurn from "./burn";


const Assets = ({ signer }) => {


    const items = [
        {
            key: '1',
            label: 'Create',
            children: <AssetCreate signer={signer} />,
        },
        {
            key: '2',
            label: 'Transfer',
            children: <AssetTransfer signer={signer} />,
        },
        {
            key: '3',
            label: 'Mint',
            children: <AssetMint signer={signer} />,
        },
        {
            key: '4',
            label: 'Burn',
            children: <AssetBurn signer={signer} />,
        },
    ];

    const onChange = () => {

    }
    return (
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    )
}

export default Assets;