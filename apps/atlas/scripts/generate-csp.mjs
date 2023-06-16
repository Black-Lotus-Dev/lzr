import fs from "fs";

const portsAndAddresses = [
  { port: 3000, address: "localhost" },
  { port: 8000, address: "localhost" },
  { port: 8080, address: "localhost" },
  { port: 3000, address: "127.0.0.1" },
  { port: 8000, address: "127.0.0.1" },
  { port: 8080, address: "127.0.0.1" },
  { port: 6969, address: "127.0.0.1" },
  { port: 4455, address: "192.168.1.224" },
];

const cspConnectSources = portsAndAddresses.map(({ port, address }) => {
  const httpSource = `http://${address}:${port}`;
  const wsSource = `ws://${address}:${port}`;
  return `${httpSource} ${wsSource}`;
});

const cspString = `default-src 'self'; connect-src 'self' ${cspConnectSources.join(
  " "
)}`;

console.log(cspString);

// fs.writeFileSync(
//   "../src-tauri/tauri.conf.json",
//   JSON.stringify({ security: { csp: cspString } }, null, 2)
// );
