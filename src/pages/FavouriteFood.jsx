import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button.jsx';
import { Input } from '@/components/ui/Input.jsx';
import { Label } from '@/components/ui/Label.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBreakfast,
  setBreakfastCount,
  setBreakfastMaximumCalories,
  setBreakfastMinimumCalories,
  setDinner,
  setDinnerCount,
  setDinnerMaximumCalories,
  setDinnerMinimumCalories,
  setFavoriteFoods,
  setLunch,
  setLunchCount,
  setLunchMaximumCalories,
  setLunchMinimumCalories,
} from '@/redux/reducer';
import { X } from 'lucide-react';
import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import * as Progress from '@radix-ui/react-progress';
import '../scss/index.scss';

function FavouriteFood() {
  const { favoriteFoods: userFavoriteFoods, tdee } = useSelector(
    state => state.user
  );
  const [favoriteFoods, setFavoriteFoodsState] = useState(
    userFavoriteFoods || ['']
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (userFavoriteFoods.length > 0) {
      setFavoriteFoodsState(userFavoriteFoods);
    }
  }, [userFavoriteFoods]);

  const handleInputChange = (index, value) => {
    const newFavoriteFoods = [...favoriteFoods];
    newFavoriteFoods[index] = value.toLowerCase();
    setFavoriteFoodsState(newFavoriteFoods);
  };

  const handleAddInput = () => {
    setFavoriteFoodsState([...favoriteFoods, '']);
  };

  const handleDeleteInput = index => {
    const newFavoriteFoods = favoriteFoods.filter((_, i) => i !== index);
    setFavoriteFoodsState(newFavoriteFoods);
  };

  const handleNextClick = async () => {
    dispatch(setFavoriteFoods(favoriteFoods));
    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 90) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 300);

    try {
      const response = await axios.post(
        'http://103.217.145.107:8000/recommendations',
        {
          favoriteFoods,
          tdee,
        }
      );

      const { data } = response;

      dispatch(setBreakfast(data.data.breakfast));
      dispatch(setLunch(data.data.lunch));
      dispatch(setDinner(data.data.dinner));
      dispatch(setBreakfastCount(data.totalData.breakfast));
      dispatch(setLunchCount(data.totalData.lunch));
      dispatch(setDinnerCount(data.totalData.dinner));
      dispatch(setBreakfastMinimumCalories(data.calories.breakfastMinimum));
      dispatch(setLunchMinimumCalories(data.calories.lunchMinimum));
      dispatch(setDinnerMinimumCalories(data.calories.dinnerMinimum));
      dispatch(setBreakfastMaximumCalories(data.calories.breakfastMaximum));
      dispatch(setLunchMaximumCalories(data.calories.lunchMaximum));
      dispatch(setDinnerMaximumCalories(data.calories.dinnerMaximum));

      setProgress(100);
    } catch (error) {
      console.error(error);
    } finally {
      setProgress(100);
      setLoading(false);
    }

    navigate('/diet-food');
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <div>
          <h2 className='text-3xl font-bold'>Choose Your Favorite Foods!</h2>
          <p
            className='font-sans text-sm font-medium'
            style={{ color: '#000' }}
          >
            Select at least 2 foods you like.
          </p>
        </div>
        <button
          onClick={handleAddInput}
          className='flex items-center justify-center bg-black text-white rounded-full pl-6 pr-6 pt-2 pb-2'
        >
          <span className='text-white'>Add Food</span>
        </button>
      </div>
      <div className='form-responsive'>
        {favoriteFoods.map((food, index) => (
          <div
            key={index}
            className='relative grid mt-6 w-full items-center mr-6'
          >
            <Label
              htmlFor={`favorite-food-${index}`}
              className='mb-4 flex justify-between items-center'
            >
              Favorite Food {index + 1}
              <button onClick={() => handleDeleteInput(index)} className='ml-2'>
                <X className='h-4 w-4 text-red-500' />
              </button>
            </Label>
            <Input
              type='text'
              id={`favorite-food-${index}`}
              placeholder={`Favorite Food ${index + 1}`}
              value={food}
              onChange={e => handleInputChange(index, e.target.value)}
              className='rounded-md p-2'
            />
          </div>
        ))}
      </div>
      <div className='flex mt-10 text-right justify-between'>
        <Button
          variant='outline'
          className='rounded-full px-10'
          onClick={handleBackClick}
        >
          Back
        </Button>
        <Button
          className='rounded-full bg-black px-10'
          onClick={handleNextClick}
          disabled={
            favoriteFoods.length < 2 || favoriteFoods.some(food => !food)
          }
        >
          Get Your Diet Food
        </Button>
      </div>
      <Dialog.Root open={loading}>
        <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-50' />
        <Dialog.Content className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md w-96'>
          <Dialog.Title className='text-lg font-bold'>Loading</Dialog.Title>
          <Dialog.Description className='mt-2 mb-4'>
            Please wait because currently we are preparing your food
          </Dialog.Description>
          <Progress.Root className='ProgressRoot' value={progress}>
            <Progress.Indicator
              className='ProgressIndicator'
              style={{ transform: `translateX(-${100 - progress}%)` }}
            />
          </Progress.Root>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}

export default FavouriteFood;
