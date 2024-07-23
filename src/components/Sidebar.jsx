import { Fragment, useState } from 'react';
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/Button.jsx';
import { useNavigate } from 'react-router-dom';
import rectangle from '@/assets/rectangle.png';

const SidebarComp = ({ children }) => {
  const [toggled, setToggled] = useState(false);
  const handleToggle = () => setToggled(!toggled);
  const menuItemStyle = { color: '#000' };
  const stepStyle = {
    color: '#000',
    marginTop: '20px',
    fontWeight: 'bold',
    padding: '0 20px',
  };
  const menus = [
    'Age',
    'Weight (Kg)',
    'Height (Cm)',
    'Gender',
    'Activity level',
    'Number of meals per day',
  ];
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sidebar
        className='sidebar'
        onBackdropClick={handleToggle}
        toggled={toggled}
        breakPoint='all'
        backgroundColor='#F9FAFB'
        width='350px'
      >
        <Menu>
          <MenuItem className='mt-6'>
            <div className='flex items-center justify-between w-full'>
              <div className='flex items-center'>
                <img src={rectangle} alt='Gradient' className='mr-2' />
                <span className='font-sans font-bold text-md'>
                  Diet Recommender System
                </span>
              </div>
              <Button onClick={handleToggle} className='ml-4' variant='ghost'>
                <CloseIcon className='cursor-pointer' />
              </Button>
            </div>
          </MenuItem>
          <MenuItem
            style={stepStyle}
            onClick={() => {
              navigate('/');
            }}
          >
            Step 1: Health Information
          </MenuItem>
          {menus.map(item => (
            <MenuItem key={item}>
              <div className='flex items-center'>
                <span className='font-sans text-sm font-medium'> {item} </span>
              </div>
            </MenuItem>
          ))}
          <MenuItem
            style={stepStyle}
            onClick={() => {
              navigate('/favourite-food');
            }}
          >
            Step 2: Favorite Foods
          </MenuItem>
          <MenuItem style={{ ...menuItemStyle }}>
            <div className='flex items-center'>
              <span className='font-sans text-sm font-medium'>
                {' '}
                Choose your favorite foods{' '}
              </span>
            </div>
          </MenuItem>
          <MenuItem
            style={stepStyle}
            onClick={() => {
              navigate('/diet-food');
            }}
          >
            Step 3: Diet Food Result
          </MenuItem>
          <MenuItem style={{ ...menuItemStyle }}>
            <div className='flex items-center'>
              <span className='font-sans text-sm font-medium'>
                {' '}
                Get diet food recommendations
              </span>
            </div>
          </MenuItem>
        </Menu>
      </Sidebar>
      <div className='responsive m-auto'>
        <button className='mb-4 mt-4 button-active' onClick={handleToggle}>
          <MenuIcon className='mb-10' />
        </button>
        {children}
      </div>
    </Fragment>
  );
};

SidebarComp.propTypes = {
  children: PropTypes.node,
};

export default SidebarComp;
