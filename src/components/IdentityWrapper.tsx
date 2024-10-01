"use client";

import {
    Avatar,
    Name
  } from '@coinbase/onchainkit/identity';
  import { base } from 'viem/chains';
  import { useAccount } from 'wagmi';
  
  export default function IdentityWrapper() {
    const { address } = useAccount();
    return (
      <div className="mx-auto max-w-2xl p-4">
        {address && (
          <div className="relative space-y-2">
            <div className="flex items-center space-x-4 rounded-full bg-white bg-opacity-20 p-2 transition-all duration-300 hover:bg-opacity-30">
              <Avatar address={address} chain={base} />
              <Name address={address} chain={base} className="text-m text-white" />
            </div>
          </div>
        )}
      </div>
    );
}