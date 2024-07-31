import { useState } from 'react';
import './App.css';
import { Card, Button, Input, Tabs } from "antd";
import { JSONTree } from 'react-json-tree';

function App() {
  const [connecting, setConnecting] = useState(false);
  const [account, setAccount] = useState('');
  const [signMessage, setSignMessage] = useState('');
  const [signMessageLoader, setSignMessageLoader] = useState(false);
  const [signMessageSignature, setSignMessageSignature] = useState('');
  const [toAddress, setToAddress] = useState('0xe4b9fa19a8846bf275559aa52f3253f7cd265e553fdeac2684cbd300a5dde799');
  const [sendAmount, setSendAmount] = useState(111);
  const [sendAssetID, setSendAssetID] = useState('0x000000004cd973c4eb83cdb8870c0de209736270491b7acc99873da1eddced5826c3b548');
  const [sendInteractionLoader, setSendInteractionLoader] = useState(false);

  const [assetTransferResponse, setAssetTransferResponse] = useState('');

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const conn = await window.moi.currentAccount();
      console.log("conn : ", conn);
      setAccount(conn.message);
      setConnecting(false)
    }
    catch (err) {
      console.log(err);
    }
  }

  const handleSign = async () => {
    try {
      setSignMessageLoader(true);
      const signResponse = await window.moi.signMessage(signMessage);
      console.log("sign response : ", signResponse);
      if (signResponse?.message?.signature) {
        setSignMessageSignature(signResponse.message.signature)
      }
      setSignMessageLoader(false);
    }
    catch (err) {
      setSignMessageLoader(false);
    }
  }

  const handleSendInteraction = async () => {
    try {
      setAssetTransferResponse('');
      let payload = {
        assetID: sendAssetID,
        amount: parseFloat(sendAmount),
        toAddress: toAddress
      }
      setSendInteractionLoader(true);
      const sendIxResponse = await window.moi.asset.send(payload);
      console.log("sendIxResponse : ", sendIxResponse);
      setAssetTransferResponse(sendIxResponse);
      setSendInteractionLoader(false);

    }
    catch (err) {
      console.log(err);
      setSendInteractionLoader(false);
    }
  }

  const onChange = (key) => {
    console.log(key);
  };

  const handleUploadManifest = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      console.log("e.target.result", e.target.result);
      // setFiles(e.target.result);
    };
  };


  const DeployLogic = () => {
    return (
      <div>
        <p className='font-bold text-lg mb-4'>Upload Manifest</p>
        <input type="file" onChange={handleUploadManifest}
          accept="application/json"
        />
      </div>
    )
  }

  const InvokeLogic = () => {
    return (
      <div>

      </div>
    )
  }

  const items = [
    {
      key: '1',
      label: 'Deploy',
      children: <DeployLogic />,
    },
    {
      key: '2',
      label: 'Invoke',
      children: <InvokeLogic />,
    },
  ];



  return (
    <>
      <h3 className='text-center font-bold p-6 text-[crimson] text-xl'>Voyage Demo Dapp</h3>
      <div className="App p-10 bg-sky-800">

        <div>
          {!account && <div>
            <Button onClick={() => handleConnect()} disabled={connecting}>{connecting ? "Connecting" : "Connect to voyage"}</Button>
          </div>}
          {account && <div className='text-left'>
            <div className='mb-5'>
              <Card title="Account Details">
                <div>
                  <p className='font-bold'>Address: </p>
                  <p>{account.address}</p>
                </div>

              </Card>
            </div>

            <Card title="Sign Message" className='mb-5'>

              <div className='mb-4'>
                <p className='font-bold mb-4'>Message: </p>
                <Input
                  onChange={(e) => {
                    setSignMessageSignature('');
                    setSignMessage(e.target.value);
                  }}
                  placeholder='Message'
                />
              </div>

              <Button onClick={() => handleSign()}
                type='primary'
                disabled={signMessageLoader}
                className='mb-4'
              >
                {signMessageLoader ? "Signing..." : "Sign Message"}
              </Button>
              {signMessageSignature && <p className='font-bold text-wrap w-[500px] break-all'>Signature : <p className='font-normal'>{signMessageSignature} </p></p>}
            </Card>


            <Card title="Asset Transfer" className='mb-5'>

              <div className='mb-4'>
                <Input
                  onChange={(e) => {
                    setSendAssetID(e.target.value);
                  }}
                  placeholder='Asset ID'
                  value={sendAssetID}
                />
              </div>
              <div className='mb-4'>
                <Input
                  onChange={(e) => {
                    setToAddress(e.target.value);
                  }}
                  placeholder='To address'
                  value={toAddress}
                />
              </div>
              <div className='mb-4'>
                <Input
                  type='number'
                  onChange={(e) => {
                    setSendAmount(e.target.value);
                  }}
                  placeholder='Amount'
                  value={sendAmount}
                />
              </div>

              <Button onClick={() => handleSendInteraction()}
                type='primary'
                disabled={sendInteractionLoader}
                className='mb-4'
              >
                {sendInteractionLoader ? "Processing..." : "Send Interaction"}
              </Button>
              <div className={`p-4 overflow-scroll ${assetTransferResponse ? 'h-[300px]' : 'h-0'}`}>
                {assetTransferResponse && <JSONTree data={assetTransferResponse}
                  invertTheme={true}
                />}
              </div>

            </Card>

            {/* <Card title="Logic call">

              <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

            </Card> */}

          </div>}
        </div>
      </div>
    </>
  );
}

export default App;
