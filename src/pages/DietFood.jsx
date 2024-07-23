import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button.jsx';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/Carousel.jsx';
import { Input } from '@/components/ui/Input.jsx';
import { Label } from '@/components/ui/Label.jsx';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import * as Dialog from '@radix-ui/react-dialog';
import { setSelectedDietFoods } from '@/redux/reducer';

function DietFood() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Accessing the state from Redux
  const {
    bmi,
    tdee,
    bmiStatus,
    breakfast,
    lunch,
    dinner,
    breakfastCount,
    lunchCount,
    dinnerCount,
    breakfastMinimumCalories,
    breakfastMaximumCalories,
    lunchMinimumCalories,
    lunchMaximumCalories,
    dinnerMinimumCalories,
    dinnerMaximumCalories,
  } = useSelector(state => state.user);

  const [loadingImages, setLoadingImages] = useState(true);

  // Add loading 1 sec delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingImages(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [loadingImages]);

  const [selectedBreakfastFoods, setSelectedBreakfastFoods] = useState([]);
  const [selectedLunchFoods, setSelectedLunchFoods] = useState([]);
  const [selectedDinnerFoods, setSelectedDinnerFoods] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const handleFoodToggle = (food, type) => {
    const toggleFood = (selectedFoods, setSelectedFoods) => {
      const isSelected = selectedFoods.includes(food.RecipeId);

      setSelectedFoods(prevFoods =>
        isSelected
          ? prevFoods.filter(item => item !== food.RecipeId)
          : [...prevFoods, food.RecipeId]
      );
    };

    if (type === 'breakfast') {
      toggleFood(selectedBreakfastFoods, setSelectedBreakfastFoods);
    } else if (type === 'lunch') {
      toggleFood(selectedLunchFoods, setSelectedLunchFoods);
    } else if (type === 'dinner') {
      toggleFood(selectedDinnerFoods, setSelectedDinnerFoods);
    }
  };

  const handleImageClick = food => {
    setSelectedFood(food);
    setDialogOpen(true);
  };

  const calculateTotalCalories = (selectedFoods, foods) => {
    return selectedFoods.reduce((total, foodId) => {
      const food = foods.find(food => food.RecipeId === foodId);
      return total + (food ? food.Calories : 0);
    }, 0);
  };

  const renderCarouselItems = (foods, type, selectedFoods) => {
    return foods.map((food, index) => {
      let imageUrl =
        'https://www.nutritionfacts.org/wp-content/uploads/2019/08/default-image.jpg'; // Replace with an actual default image URL if needed

      try {
        // Parse ImagesClean to a valid JSON array
        const cleanedImages = food.ImagesClean.replace(/'/g, '"') // Replace single quotes with double quotes
          .replace(/[\[\]]/g, ''); // Remove square brackets

        // Split the cleaned string into an array
        const imagesArray = cleanedImages
          .split(' ')
          .map(img => img.trim().replace(/"/g, '').replace(/,$/, ''));

        // Check if the array has valid URLs
        if (imagesArray.length > 0 && imagesArray[0] !== 'character(0') {
          imageUrl = imagesArray[0]; // Use the first image URL
        }
      } catch (error) {
        console.error('Error parsing ImagesClean:', error);
      }

      return (
        <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/3'>
          <div className='p-1'>
            {loadingImages ? (
              <Skeleton className='w-full h-64' />
            ) : (
              <img
                src={imageUrl}
                alt={food.NameClean}
                className='rounded-md w-full h-64 object-cover cursor-pointer'
                onClick={() => handleImageClick(food)}
              />
            )}
            <div className='text-center'>
              <input
                type='checkbox'
                checked={selectedFoods.includes(food.RecipeId)}
                onChange={() => handleFoodToggle(food, type)}
                className='mr-2'
              />
              <span>{food.NameClean || <Skeleton />}</span>
            </div>
            <p className='text-center'>
              {food.Calories ? `${food.Calories.toFixed(1)} Cal` : <Skeleton />}
            </p>
          </div>
        </CarouselItem>
      );
    });
  };

  const selectedBreakfastCalories = calculateTotalCalories(
    selectedBreakfastFoods,
    breakfast
  );
  const selectedLunchCalories = calculateTotalCalories(
    selectedLunchFoods,
    lunch
  );
  const selectedDinnerCalories = calculateTotalCalories(
    selectedDinnerFoods,
    dinner
  );

  const handleCreatePlan = () => {
    const selectedFoods = {
      breakfast: selectedBreakfastFoods.map(foodId =>
        breakfast.find(food => food.RecipeId === foodId)
      ),
      lunch: selectedLunchFoods.map(foodId =>
        lunch.find(food => food.RecipeId === foodId)
      ),
      dinner: selectedDinnerFoods.map(foodId =>
        dinner.find(food => food.RecipeId === foodId)
      ),
    };
    dispatch(setSelectedDietFoods(selectedFoods));
    navigate('/time-to-eat');
  };

  return (
    <>
      <h2 className='text-3xl font-bold mb-4'>Choose Your Diet Food!</h2>
      <p className={'font-sans text-sm font-medium'} style={{ color: '#000' }}>
        Please select foods for Breakfast, Dinner, and Lunch according to your
        calorie needs.
      </p>
      <div className='form-responsive mb-10'>
        <div className='grid mt-6 w-full items-start mr-6'>
          <div className='mb-4 text-xl font-semibold'>BMI Calculator</div>
          <Input
            style={{ borderColor: '#939393' }}
            className='text-xl font-bold rounded-2xl border-2 text-center h-14'
            value={`${bmi.toFixed(2)} Kg/m²`}
            readOnly
          />
          <div
            className={'font-sans text-sm font-medium mt-4'}
            style={{ color: '#000' }}
          >
            <div className='flex'>
              <div>Status:</div>
              &nbsp;<b>{bmiStatus}</b>
            </div>
            <div className='flex'>
              <div>BMI sehat:</div>
              &nbsp;<b>18.5 kg/m² - 25 kg/m²</b>
            </div>
          </div>
        </div>
        <div className='grid mt-6 w-full items-start'>
          <div className='grid w-full items-center'>
            <div className='mb-4 text-2xl font-semibold'>
              Calorie Calculator
            </div>
            <div
              className={'font-sans text-sm font-medium -mt-4'}
              style={{ color: '#000' }}
            >
              <div className='flex mb-4'>
                <div>Calories need to maintain weight</div>
              </div>

              <div className='flex'>
                <div>Maintaining Weight (TDEE):</div>
                &nbsp;<b>{tdee.toFixed(1)} Cal/day</b>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center'>
        <Label className={'font-sans text-2xl font-semibold'}>Breakfast</Label>
        <span className='ml-4 text-lg'>{breakfastCount} items</span>
        <span className='ml-4 text-lg'>
          {selectedBreakfastCalories.toFixed(1)} of Min:{' '}
          {breakfastMinimumCalories.toFixed(1)} Cal, Max:{' '}
          {breakfastMaximumCalories.toFixed(1)} Cal
        </span>
      </div>
      <Carousel
        opts={{
          align: 'start',
        }}
        className='w-full mt-4 mb-8'
      >
        <CarouselContent>
          {renderCarouselItems(breakfast, 'breakfast', selectedBreakfastFoods)}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className='flex items-center'>
        <Label className={'font-sans text-2xl font-semibold'}>Lunch</Label>
        <span className='ml-4 text-lg'>{lunchCount} items</span>
        <span className='ml-4 text-lg'>
          {selectedLunchCalories.toFixed(1)} of Min:{' '}
          {lunchMinimumCalories.toFixed(1)} Cal, Max:{' '}
          {lunchMaximumCalories.toFixed(1)} Cal
        </span>
      </div>
      <Carousel
        opts={{
          align: 'start',
        }}
        className='w-full mt-4 mb-8'
      >
        <CarouselContent>
          {renderCarouselItems(lunch, 'lunch', selectedLunchFoods)}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className='flex items-center'>
        <Label className={'font-sans text-2xl font-semibold'}>Dinner</Label>
        <span className='ml-4 text-lg'>{dinnerCount} items</span>
        <span className='ml-4 text-lg'>
          {selectedDinnerCalories.toFixed(1)} of Min:{' '}
          {dinnerMinimumCalories.toFixed(1)} Cal, Max:{' '}
          {dinnerMaximumCalories.toFixed(1)} Cal
        </span>
      </div>
      <Carousel
        opts={{
          align: 'start',
        }}
        className='w-full mt-4 mb-8'
      >
        <CarouselContent>
          {renderCarouselItems(dinner, 'dinner', selectedDinnerFoods)}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className='flex mt-10 text-right justify-between'>
        <Button
          variant='outline'
          className='rounded-full px-10'
          onClick={() => {
            navigate('/favourite-food');
          }}
        >
          Back
        </Button>
        <Button
          className='rounded-full bg-black px-10'
          onClick={handleCreatePlan}
        >
          Create Plan
        </Button>
      </div>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
          <Dialog.Content className='fixed inset-0 flex items-center justify-center p-4'>
            <div className='bg-white p-6 rounded-lg shadow-lg max-w-lg w-full'>
              <Dialog.Title className='text-2xl font-bold mb-2'>
                {selectedFood?.NameClean}
              </Dialog.Title>
              <Dialog.Description className='mt-2 text-sm'>
                <p>Description: {selectedFood?.DescriptionClean}</p>
                <p>Keywords: {selectedFood?.KeywordsClean}</p>
                <p>Category: {selectedFood?.RecipeCategoryClean}</p>
              </Dialog.Description>
              <Dialog.Description className='mt-2'>
                <h3 className='text-xl font-semibold mb-2'>Nutrition Facts</h3>
                <ul className='list-disc list-inside'>
                  <li>Calories: {selectedFood?.Calories}</li>
                  <li>Fat Content: {selectedFood?.FatContent} g</li>
                  <li>
                    Saturated Fat Content: {selectedFood?.SaturatedFatContent} g
                  </li>
                  <li>
                    Cholesterol Content: {selectedFood?.CholesterolContent} mg
                  </li>
                  <li>Sodium Content: {selectedFood?.SodiumContent} mg</li>
                  <li>
                    Carbohydrate Content: {selectedFood?.CarbohydrateContent} g
                  </li>
                  <li>Fiber Content: {selectedFood?.FiberContent} g</li>
                  <li>Sugar Content: {selectedFood?.SugarContent} g</li>
                  <li>Protein Content: {selectedFood?.ProteinContent} g</li>
                </ul>
                <h3 className='text-xl font-semibold mt-4 mb-2'>Ingredients</h3>
                <p>{selectedFood?.RecipeIngredientPartsClean}</p>
                <h3 className='text-xl font-semibold mt-4 mb-2'>
                  Instructions
                </h3>
                <p>{selectedFood?.RecipeInstructionsClean}</p>
              </Dialog.Description>
              <Dialog.Close asChild>
                <Button variant='outline' className='mt-4'>
                  Close
                </Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

export default DietFood;
