const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),

  // Konfiguracija omrežja
  // Za razvoj in testiranje uporabljamo lokalno omrežje
  networks: {
    development: {
      network_id: "*",
      host: 'localhost',
      port: 8545
    }
  }
};
