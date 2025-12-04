import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [sepolia],
  transports: {

    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/0bmBZFrqeNFoykpzjAdmj'), 

  },
  connectors: [
    injected(),   
  ],
});