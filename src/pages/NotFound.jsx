import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button.jsx';

function NotFound() {
  const navigate = useNavigate();

  const handleBack = () => {
    // Navigate back to the Onboarding page
    navigate('/');
  };

  return (
    <main role='main' className='container mx-auto text-center mt-20'>
      <header>
        <h1 className='text-2xl font-bold font-sans'>404 Page Not Found</h1>
        <p
          className={'font-sans text-md font-medium mt-4'}
          style={{ color: '#000' }}
        >
          Sorry, the page you are looking for does not exist.
        </p>
      </header>
      <section>
        <Button className={'mt-10'} onClick={handleBack}>
          Back to Onboarding
        </Button>
      </section>
    </main>
  );
}

export default NotFound;
