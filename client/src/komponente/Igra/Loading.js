import React from 'react'

class Loading extends React.Component {
  render() {

    return(
      <div className="container">
        <div className="row">
          <div className="col-md-12">

            <h3>Fetching game state...</h3>

          </div>
        </div>
      </div>
    );

  }
}

export default Loading;
