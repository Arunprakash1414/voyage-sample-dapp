import { Typography } from "antd";
import { Button, Input, message, Switch } from "antd";
import React, { useState } from "react";

const AssetBurn = ({ signer }) => {

    const [assetID, setAssetID] = useState('');
    const [amount, setAmount] = useState(0);
    const [loader, setLoader] = useState(false);
    const [fuelLimit, setFuelLimit] = useState(100)
    const [nonce, setNonce] = useState(0);
    const [showOptionalParams, setShowOptionalParams] = useState(false);
    const [interactionHash, setInteractionHash] = useState('');

    const handleAssetBurn = async () => {
        try {

            setInteractionHash('');
            if (assetID.trim() == '' || amount <= 0) {
                message.error('All fields are mandatory')
                return
            }
            let payload = {
                type: 7,
                payload: {
                    amount: parseInt(amount),
                    asset_id: assetID,
                },
                fuel_price: 1,
                fuel_limit: 100,

            }

            if (nonce) {
                payload = { ...payload, nonce: parseInt(nonce) }
            }

            setLoader(true);
            const response = await signer.sendInteraction(payload);
            setInteractionHash(response.hash);
            setLoader(false);

        }
        catch (err) {

            setLoader(false);
            if (err?.message?.includes("terminated premature")) {
                message.error(
                    "user rejected the request"
                );

            } else {
                message.error(err.message);

            }
        }
    }

    return (
        <div>
            <div className='mb-4'>
                <div >
                    <Typography className="font-semibold mb-2 text-xs text-pink-500">Asset ID : </Typography>
                    <Input
                        onChange={(e) => {
                            setAssetID(e.target.value);
                        }}
                        placeholder='Asset ID'
                        value={assetID}
                    />
                </div>
            </div>

            <div className='mb-4'>
                <Typography className="font-semibold mb-2 text-xs text-pink-500">Amount : </Typography>
                <Input
                    type="number"
                    onChange={(e) => {
                        setAmount(e.target.value);
                    }}
                    placeholder='Amount'
                    value={amount}
                />
            </div>

            <div className="flex items-center my-3">
                <Typography>Optional Parameters</Typography>
                <div className="ml-2">  <Switch
                    onChange={() => setShowOptionalParams(!showOptionalParams)}
                /></div>
            </div>

            {showOptionalParams && <div>
                <Typography className="font-semibold mb-2 text-xs text-pink-500">Nonce : </Typography>
                <div className='mb-4'>
                    <Input
                        onChange={(e) => {
                            setNonce(e.target.value);
                        }}
                        placeholder='nonce'
                        value={nonce}
                        type="number"
                    />
                </div>

                <div className='mb-4'>
                    <Typography className="font-semibold mb-2 text-xs text-pink-500">Fuel Price : </Typography>
                    <Input
                        placeholder='Fuel Price'
                        value={1}
                        disabled
                    />
                </div>

                <div className='mb-4'>
                    <Typography className="font-semibold mb-2 text-xs text-pink-500">Fuel Limit : </Typography>
                    <Input
                        onChange={(e) => {
                            setFuelLimit(e.target.value);
                        }}
                        placeholder='Fuel Limit'
                        value={fuelLimit}
                        type="number"
                    />
                </div>
            </div>}


            {interactionHash &&

                <div className='mb-4'>
                    <div >
                        <Typography><span className="font-semibold text-pink-500">Interaction Hash :</span> {interactionHash}
                            <span>

                                <a href={`https://voyage.moi.technology/interaction/?${interactionHash}`} target="_blank"
                                    className="ml-4 text-blue-700 !underline font-bold"
                                >View on voyage</a>
                            </span>
                        </Typography>

                    </div>
                </div>

            }


            <div className='mb-4'>
                <Button onClick={() => handleAssetBurn()}
                    type="primary"
                    loading={loader}
                    disabled={loader}
                >
                    Burn
                </Button>
            </div>

        </div>
    );
}

export default AssetBurn;