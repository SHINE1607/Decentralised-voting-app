module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      from : "0x7b31d8e977e9114e304b94352f4264514f5e7c38"
      // Match any network id
    },
    develop: {
      port: 8545
    }
  }
};
