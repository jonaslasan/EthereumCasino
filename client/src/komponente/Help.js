import React from 'react'

const Help = () => (
  <div className="container text-left" >
    <div className="row">
      <div className="col-md-12 text-left">
      <div className="card">
        <div className="card-header">
          <h3>Help</h3>
        </div>
        <div className="card-body" id="izborUporabnika">
        <h3>Game flow</h3>
        <br />
        <h5>Entry phase</h5>
        <p>Entry phase end when both players provided their digital signature and paid the entry fee.</p>

        <h5>Reveal phase</h5>
        <p>In reveal phase both players have to provide the initial value that matches the digital signature.</p>
        <p>If a player doesn't reveal his value in approximately 24 hours after the first player revealed his value, the first player is entitled to the reward.</p>

        <h5>End phase</h5>
        <p>End phase determines the winner based on both provided values.</p>
        <p>Winner takes the reward.</p>

        <hr />
        <h4>Provably-Fair</h4>
        <p>Every game is forever written to the Ethereum blockchain. Every game outcome is deterministic, meaning that a given input will always give the same output.</p>
        <p>Player can query data about any game and manually check that it was 'played by the rules'.</p>
        <br />

        <h5>Determining the winner</h5>
        <p>1. Calculate SHA3-256 hash of both values</p>
        <p>2. Calculate XOR function of both hashes</p>
        <p>3. Calculate the remainder of the division by 2</p>
        <p>4. Remainder tells us the winner's index</p>

        <hr />

        <h5>Example:</h5>
        <p>We get the hashes from query:</p>
        <p>First hash: 0xdd4c72fd37a1e8967b3908a45b157d8f42832bf27e54771172b66d2277982e6e</p>
        <p>Second hash: 0x87c975c6e37e110275bd08d18641a88e49fc19fea12323658764365bf7070c66</p>
        <br />
        <p>XOR function of both hashes (hex): 0x5a85073bd4dff9940e840075dd54d5010b7f320cdf775474f5d25b79809f2208</p>
        <p>Decimal number: 40943196957389124735012793317602074271020773181868967876318447440255778759176</p>
        <p>Winner's index (remainder of the division by 2): 0</p>

        <br />
        <p>We can help ourselves with the following tools: <a href="http://xor.pw/">XOR function</a> and <a href="https://www.rapidtables.com/convert/number/hex-to-binary.html">hex to decimal converter</a>.</p>
        </div>

      </div>
    </div>
  </div>
</div>
);

export default Help;
