"use client";

import {
    Avatar,
    Name
  } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import { useAccount } from 'wagmi';
import { normalize } from 'viem/ens'
import { publicClient } from '../client'
import { useEffect, useState } from 'react';
import { getName } from '@coinbase/onchainkit/identity';

export default function IdentityWrapper() {
  const { address } = useAccount();
  const [ensText, setEnsText] = useState<string | null>(null);

  useEffect(() => {
    console.log("Address:", address); // Debug log
    const fetchEnsText = async () => {
      if (address) {
        try {
          const name = await getName({chain: base, address: address}); // Get the name of the address
          console.log("Name:", name);
          const normalizedAddress = normalize(name as string); // Normalize the fetched name
          console.log("Normalized Address:", normalizedAddress); 
          const text = await publicClient.getEnsText({
            name: normalizedAddress,
            key: 'com.twitter'
          });
          console.log("ENS Text Response:", text); 
          setEnsText(text);
        } catch (error) {
          console.error("Error fetching ENS text:", error); 
        }
      }
    };
    fetchEnsText();
  }, [address]);

  return (
    <div className="mx-auto max-w-2xl p-4">
      {address ? (
        <div className="relative space-y-2">
          <div className="flex items-center space-x-4 rounded-full bg-white bg-opacity-20 p-2 transition-all duration-300 hover:bg-opacity-30">
            <Avatar address={address} chain={base} />
            <Name address={address} chain={base} className="text-m text-white" />
          </div>
          {ensText && (
            <div className="text-white">
              Twitter account: <a href={`https://x.com/${ensText}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{ensText}</a>
            </div>
          )}
        </div>
      ) : (
        <div className="text-white">No address found</div> // Debug message
      )}
    </div>
  );
}