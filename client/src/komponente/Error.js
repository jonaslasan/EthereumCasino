import React from 'react'

const Error = () => (
    <main className="container">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Prišlo je do napake!</h4>
        <br />
        <p>Could not connect to web3 provider.</p>
        <p>Make sure you have <a href="https://metamask.io/">MetaMask</a> installed.</p>
        <p>Make sure that you allowed MetaMask to connect with this dapp.</p>
      </div>
    </main>
);

export default Error;
