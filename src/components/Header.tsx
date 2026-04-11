import Image from 'next/image';

const Header = () => (
  <div>
    <Image src="/header-banner.png" alt="Company Header" width={800} height={100} style={{ width: '100%', height: 'auto' }} />
  </div>
);

export default Header;
