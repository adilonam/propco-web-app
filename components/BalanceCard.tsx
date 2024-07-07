import Image, { StaticImageData } from 'next/image';

type BalanceCardProps = {
  balance: number;
  logoSrc: StaticImageData;
  currency: string;
};

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, logoSrc, currency }) => {
  return (
    <div className="max-w-sm mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden mt-4">
      <div className="flex items-center border-b border-gray-200 dark:border-gray-700 py-5 px-7">
        <div className="w-12 h-12 relative">
          <Image src={logoSrc} alt="Logo" layout="fill" objectFit="contain" />
        </div>
        <div className="ml-4">
          <h2 className="text-gray-800 dark:text-gray-200 text-xl font-semibold">Account Balance</h2>
          <p className="text-gray-600 dark:text-gray-400">{currency}</p>
        </div>
      </div>
      <div className="px-7 pt-6 pb-10">
        <div className="text-center mb-4">
          <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">{balance.toFixed(2)}</span>
        </div>
        <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Funds
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;
