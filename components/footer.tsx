import { Logo } from '../public/logo';
import { Insta } from '../public/icons/insta';

export default function Footer() {
  return (
    <footer className="p-8 justify-between items-center block md:flex max-w-screen-xl mx-auto">

      <div className='w-full flex justify-center md:justify-start'>
        <a href="https://www.instagram.com/412studios.ca/" target='_blank' className='w-8 h-8 mr-2 w-full md:w-auto' aria-label="instagram link">
          <Insta className="social-icon h-full w-auto m-auto md:ml-0" />
        </a>
        {/* 
        <a href="https://www.instagram.com/412studios.ca/" target='_blank' className='w-8 h-8 mr-2 w-full md:w-auto'>
          <Insta className="social-icon h-full w-auto m-auto md:ml-0" />
        </a>
        <a href="https://www.instagram.com/412studios.ca/" target='_blank' className='w-8 h-8 mr-2 w-full md:w-auto'>
          <Insta className="social-icon h-full w-auto m-auto md:ml-0" />
        </a> 
        */}
      </div>
      
      {/* <div className='w-full text-center pt-4 pb-2 md:pt-0'>
        <p>
          412 Studios
        </p>
      </div> */}

      <div className='w-full'>
        <a href="#" className="w-32 h-auto py-2 flex m-auto md:ml-auto md:mr-0" aria-label="logo footer">
          <Logo className="h-full w-auto" />
        </a>
      </div>

    </footer>
  );
}