'use client';
import { useAccount } from 'wagmi';
import Footer from 'src/components/Footer';
import IdentityWrapper from 'src/components/IdentityWrapper';
import { ONCHAINKIT_LINK } from 'src/links';
import OnchainkitSvg from 'src/svg/OnchainkitSvg';
import WalletWrapper from 'src/components/WalletWrapper';
import { motion } from 'framer-motion';

export default function Page() {
  const { isConnected } = useAccount();

  return (
    <div className='flex h-full w-96 max-w-full flex-col px-1 font-sans md:w-[1008px]'>
      <section className='mt-6 mb-6 flex w-full flex-col md:flex-row'>
        <div className='flex w-full flex-row items-center justify-between gap-2 md:gap-0'>
          <a
            href={ONCHAINKIT_LINK}
            title="onchainkit"
            target="_blank"
            rel="noreferrer"
          >
            <OnchainkitSvg />
          </a>
          <div className="flex items-center gap-3">
            <WalletWrapper />
          </div>
        </div>
      </section>
      <section className="flex w-full flex-col items-center justify-center gap-4 rounded-xl px-2 py-4 md:grow">
        {isConnected ? (
          <>
            <IdentityWrapper />
            <div className='flex w-full max-w-md flex-col items-center rounded-lg bg-gray-50/50 p-6 backdrop-blur-sm'>
              <motion.h1 
                className='mb-4 text-center font-bold text-4xl'
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  rotate: [0, -5, 5, -5, 0] 
                }}
                transition={{ 
                  duration: 1.0,
                  rotate: { duration: 0.7, delay: 0.8 }
                }}
              > 
                Looking a bit bare? 
              </motion.h1>
              <div className='flex flex-col items-center'>
                <p className='text-center'> Go to <a href="https://base.or/names" target="_blank" rel="noreferrer" className=' hover:text-[#0052ff] hover:text-bold'>Basename</a> to add some details to your profile. <br /> Then see it everywhere. </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-48 w-full max-w-md items-center justify-center rounded-lg bg-gray-100 p-6 text-center text-gray-600">
            Please connect your account to see your profile
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
