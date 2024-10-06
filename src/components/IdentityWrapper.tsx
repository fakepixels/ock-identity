'use client';

import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { getName } from '@coinbase/onchainkit/identity';
import { Github, Globe, Twitter, ChevronDown } from 'lucide-react'; // Import ChevronDown
import { useEffect, useState } from 'react';
import { base } from 'viem/chains';
import { normalize } from 'viem/ens';
import { useAccount } from 'wagmi';
import { publicClient } from '../client';
import { motion } from 'framer-motion'; // Import framer-motion
import { FarcasterSocialIcon } from '../svg/FarcasterIcon';

export default function IdentityWrapper() {
  const { address } = useAccount();
  const [ensText, setEnsText] = useState<{
    twitter: string | null;
    github: string | null;
    farcaster: string | null;
    url: string | null;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility

  useEffect(() => {
    
    const fetchEnsText = async () => {
     
      if (address) {
        const cachedData = localStorage.getItem(address);
        if (cachedData) {
          setEnsText(JSON.parse(cachedData));
          return;
        }

        try {
          
          const name = await getName({ chain: base, address: address }); 
          const normalizedAddress = normalize(name as string); 
          
          const twitterText = await publicClient.getEnsText({
            name: normalizedAddress,
            key: 'com.twitter',
          });
      
          const githubText = await publicClient.getEnsText({
            name: normalizedAddress,
            key: 'com.github',
          });
       
          const farcasterText = await publicClient.getEnsText({
            name: normalizedAddress,
            key: 'xyz.farcaster',
          });
         
          const urlText = await publicClient.getEnsText({
            name: normalizedAddress,
            key: 'url',
          });
          

          const fetchedData = {
            twitter: twitterText,
            github: githubText,
            farcaster: farcasterText,
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
        <motion.div
          className="relative space-y-2"
          initial={{ opacity: 0, y: -20 }} // Initial state
          animate={{ opacity: 1, y: 0 }} // Animated state
          transition={{ duration: 0.5 }} // Animation duration
        >
          
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
         <div className='flex cursor-pointer items-center justify-between space-x-2 rounded-full bg-white bg-opacity-20 p-2 transition-all duration-300 hover:bg-opacity-30' onClick={() => setIsOpen(!isOpen)}> 
            <div className='flex items-center space-x-2'>
              <Avatar address={address} chain={base} />
              <Name address={address} chain={base} className="text-m text-white" />
            </div>
            <ChevronDown className={`h-4 w-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} /> {/* Dropdown arrow */}
          </div>
          {ensText && (
            <motion.div
              className='rounded-lg bg-white bg-opacity-20 p-4 text-white shadow-md'
              initial={{ height: 0, opacity: 0 }} // Initial state
              animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }} // Animated state
              transition={{ duration: 0.5, ease: "easeInOut" }} // Animation duration and easing
              style={{ overflow: 'hidden' }} // Ensure smooth height transition
            >
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
              <div className="mt-2 flex items-center space-x-2">
                <FarcasterSocialIcon className="h-4 w-4" />
                <span>Farcaster:</span>
                <a
                  href={`https://warpcast.com/${ensText.farcaster}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {ensText.farcaster}
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
                  {ensText.url?.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <div className="text-white">
          Connect your wallet to view your profile card.
        </div>
      )}
    </div>
  );
}
