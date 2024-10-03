'use client';

import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { getName } from '@coinbase/onchainkit/identity';
import { Github, Globe, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { base } from 'viem/chains';
import { normalize } from 'viem/ens';
import { useAccount } from 'wagmi';
import { publicClient } from '../client';

export default function IdentityWrapper() {
  const { address } = useAccount();
  const [ensText, setEnsText] = useState<{
    twitter: string | null;
    github: string | null;
    url: string | null;
  } | null>(null);

  useEffect(() => {
    console.log('Address:', address); // Debug log
    const fetchEnsText = async () => {
      if (address) {
        const cachedData = localStorage.getItem(address);
        if (cachedData) {
          setEnsText(JSON.parse(cachedData));
          return;
        }

        try {
          const name = await getName({ chain: base, address: address }); // Get the name of the address
          console.log('Name:', name);
          const normalizedAddress = normalize(name as string); // Normalize the fetched name
          console.log('Normalized Address:', normalizedAddress);
          const twitterText = await publicClient.getEnsText({
            name: normalizedAddress,
            key: 'com.twitter',
          });
          const githubText = await publicClient.getEnsText({
            name: normalizedAddress,
            key: 'com.github',
          });
          const urlText = await publicClient.getEnsText({
            name: normalizedAddress,
            key: 'url',
          });
          console.log('ENS Text Responses:', {
            twitterText,
            githubText,
            urlText,
          });
          const fetchedData = {
            twitter: twitterText,
            github: githubText,
            url: urlText,
          };
          setEnsText(fetchedData);
          localStorage.setItem(address, JSON.stringify(fetchedData));
        } catch (error) {
          console.error('Error fetching ENS text:', error);
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
            <Name
              address={address}
              chain={base}
              className="text-m text-white"
            />
          </div>
          {ensText && (
            <div className='rounded-lg bg-white bg-opacity-20 p-4 text-white shadow-md'>
              <div className="flex items-center space-x-2">
                <Twitter className="h-4 w-4" />
                <span>Twitter:</span>
                <a
                  href={`https://x.com/${ensText.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {ensText.twitter}
                </a>
              </div>
              <div className='mt-2 flex items-center space-x-2'>
                <Github className='h-4 w-4' />
                <span>Github:</span>
                <a
                  href={`https://github.com/${ensText.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {ensText.github}
                </a>
              </div>
              <div className='mt-2 flex items-center space-x-2'>
                <Globe className="h-4 w-4" />
                <span>Website:</span>
                <a
                  href={ensText.url ?? ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {ensText.url}
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-white">
          Connect your wallet to view your profile card.
        </div>
      )}
    </div>
  );
}
