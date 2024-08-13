import { useState } from 'react';
import './App.css';
import { Card, Button, Input, message } from "antd";
import Assets from './assets';

function App() {
  const [connecting, setConnecting] = useState(false);
  const [account, setAccount] = useState('');
  const [signMessage, setSignMessage] = useState('');
  const [signMessageLoader, setSignMessageLoader] = useState(false);
  const [signMessageSignature, setSignMessageSignature] = useState('');
  const [signer, setSigner] = useState(null);


  const handleConnect = async () => {
    try {
      // setConnecting(true);
      const conn = await window.moi.currentAccount();
      if (!conn?.message?.address) {
        message.error(conn?.message)
        return;
      }
      else {
        setAccount(conn.message);

        const _signer = window.moi.getSigner()
        setSigner(_signer);

      }
      // setConnecting(false)
    }
    catch (err) {
      console.log(err);
    }
  }

  const handleSign = async () => {
    try {
      setSignMessageLoader(true);
      const signer = await window.moi.getSigner();
      const signResponse = await signer.sign(signMessage);
      console.log("sign response : ", signResponse);


      if (signResponse?.signature) {
        console.log(signResponse.signature)
        setSignMessageSignature(signResponse.signature)
      }
      else if (signResponse?.message) {
        message.error(signResponse?.message)
      }
      setSignMessageLoader(false);
    }
    catch (err) {
      setSignMessageLoader(false);
    }
  }



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
              {signMessageSignature && <p className='font-bold text-wrap w-[500px]'>Signature : <p className='font-normal'>{signMessageSignature} </p></p>}
            </Card>


            {signer && <Card title="Asset" className='mb-5'>

              <Assets signer={signer} />

            </Card>}

          </div>}
        </div>
      </div>
    </>
  );
}

export default App;
