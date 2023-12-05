import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Custom404 = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/'); // Redirect to home page
  }, [router]);

  return (
    <div>
      <p>Redirecting to home...</p>
      {/* You can add additional styling or a loading spinner here if desired */}
    </div>
  );
};

export default Custom404;
