import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button.jsx';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/Carousel.jsx';
import { Label } from '@/components/ui/Label.jsx';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { resetUserState } from '@/redux/reducer'; // assuming you have this action in your reducer

function TimeToEat() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedDietFoods, tdee } = useSelector(state => state.user);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedFoodImage, setSelectedFoodImage] = useState('');
  const [loadingImages, setLoadingImages] = useState(true);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);

  // Add loading 1 sec delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingImages(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [loadingImages]);

  const handleImageClick = (food, imageUrl) => {
    setSelectedFood(food);
    setSelectedFoodImage(imageUrl);
    setDialogOpen(true);
  };

  const parseImagesClean = imagesString => {
    try {
      // Replace single quotes with double quotes and remove square brackets
      const cleanedImages = imagesString
        .replace(/'/g, '"')
        .replace(/[\[\]]/g, '');

      // Split the cleaned string into an array
      const imagesArray = cleanedImages
        .split(' ')
        .map(img => img.trim().replace(/"/g, '').replace(/,$/, ''));

      // Filter out any invalid URLs
      return imagesArray.filter(img => img.startsWith('http'));
    } catch (error) {
      console.error('Error parsing ImagesClean:', error);
      return [];
    }
  };

  const renderFoodList = foods => {
    return foods.map((food, index) => {
      let imageUrl =
        'https://www.nutritionfacts.org/wp-content/uploads/2019/08/default-image.jpg'; // Default image URL

      // Parse the ImagesClean field
      const imagesArray = parseImagesClean(food.ImagesClean);

      // Use the first valid image URL if available
      if (imagesArray.length > 0) {
        imageUrl = imagesArray[0];
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
                onClick={() => handleImageClick(food, imageUrl)}
              />
            )}
            <div className='text-center'>
              <span>{food.NameClean}</span>
            </div>
            <p className='text-center'>
              {food.Calories ? `${food.Calories.toFixed(1)} Cal` : 'N/A'}
            </p>
          </div>
        </CarouselItem>
      );
    });
  };

  const calculateTotalCalories = foods => {
    return foods.reduce((total, food) => total + food.Calories, 0);
  };

  const selectedBreakfastCalories = calculateTotalCalories(
    selectedDietFoods.breakfast
  );
  const selectedLunchCalories = calculateTotalCalories(selectedDietFoods.lunch);
  const selectedDinnerCalories = calculateTotalCalories(
    selectedDietFoods.dinner
  );
  const totalSelectedCalories =
    selectedBreakfastCalories + selectedLunchCalories + selectedDinnerCalories;

  const handleFinish = () => {
    setFinishDialogOpen(true);
  };

  const handleResetAndBack = () => {
    dispatch(resetUserState());
    navigate('/');
  };

  return (
    <>
      <h2 className='text-3xl font-bold mb-4'>Time to Eat!</h2>
      <p className={'font-sans text-sm font-medium'} style={{ color: '#000' }}>
        Here are the foods you have selected and a comparison of calories with
        what you need.
      </p>

      <div className='flex items-center'>
        <Label className={'font-sans text-2xl font-semibold'}>Breakfast</Label>
      </div>
      <Carousel
        opts={{
          align: 'start',
        }}
        className='w-full mt-4 mb-8'
      >
        <CarouselContent>
          {renderFoodList(selectedDietFoods.breakfast)}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className='flex items-center'>
        <Label className={'font-sans text-2xl font-semibold'}>Lunch</Label>
      </div>
      <Carousel
        opts={{
          align: 'start',
        }}
        className='w-full mt-4 mb-8'
      >
        <CarouselContent>
          {renderFoodList(selectedDietFoods.lunch)}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className='flex items-center'>
        <Label className={'font-sans text-2xl font-semibold'}>Dinner</Label>
      </div>
      <Carousel
        opts={{
          align: 'start',
        }}
        className='w-full mt-4 mb-8'
      >
        <CarouselContent>
          {renderFoodList(selectedDietFoods.dinner)}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className='form-responsive'>
        <div className='grid mt-6 w-full items-start mr-6'>
          <div className='grid w-full items-start'>
            <div className='grid w-full items-center'>
              <div className='mb-4 text-xl font-semibold'>
                Calorie Calculator
              </div>
              <div
                className={'font-sans text-sm font-medium -mt-4'}
                style={{ color: '#000' }}
              >
                <div className='flex'>
                  <div>Recommended daily calories:</div>
                  &nbsp;<b>{tdee.toFixed(1)} Cal/day</b>
                </div>
                <div className='flex'>
                  <div>Calories from selected foods:</div>
                  &nbsp;<b>{totalSelectedCalories.toFixed(1)} Cal/day</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex mt-10 text-right justify-between'>
        <Button
          variant='outline'
          className='rounded-full px-10'
          onClick={() => {
            navigate('/diet-food');
          }}
        >
          Back
        </Button>
        <Button className='rounded-full bg-black px-10' onClick={handleFinish}>
          Finish!
        </Button>
      </div>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
          <Dialog.Content className='fixed inset-0 flex items-center justify-center p-4'>
            <div className='bg-white p-6 rounded-lg shadow-lg max-w-lg w-full'>
              <Dialog.Title className='text-xl font-bold'>
                {selectedFood?.NameClean}
              </Dialog.Title>
              <Dialog.Description className='mt-2'>
                <div className='flex justify-center mb-4'>
                  <img
                    src={selectedFoodImage}
                    alt={selectedFood?.NameClean}
                    className='rounded-md max-w-full h-auto'
                  />
                </div>
                <p>
                  <b>Calories:</b> {selectedFood?.Calories}
                </p>
                <p>
                  <b>Fat Content:</b> {selectedFood?.FatContent}g
                </p>
                <p>
                  <b>Saturated Fat Content:</b>{' '}
                  {selectedFood?.SaturatedFatContent}g
                </p>
                <p>
                  <b>Cholesterol Content:</b> {selectedFood?.CholesterolContent}
                  mg
                </p>
                <p>
                  <b>Sodium Content:</b> {selectedFood?.SodiumContent}mg
                </p>
                <p>
                  <b>Carbohydrate Content:</b>{' '}
                  {selectedFood?.CarbohydrateContent}g
                </p>
                <p>
                  <b>Fiber Content:</b> {selectedFood?.FiberContent}g
                </p>
                <p>
                  <b>Sugar Content:</b> {selectedFood?.SugarContent}g
                </p>
                <p>
                  <b>Protein Content:</b> {selectedFood?.ProteinContent}g
                </p>
                <h2 className='text-lg font-semibold mt-4'>Ingredients</h2>
                <p>{selectedFood?.RecipeIngredientPartsClean}</p>
                <h2 className='text-lg font-semibold mt-4'>Instructions</h2>
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

      <Dialog.Root open={finishDialogOpen} onOpenChange={setFinishDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
          <Dialog.Content className='fixed inset-0 flex items-center justify-center p-4'>
            <div className='bg-white p-6 rounded-lg shadow-lg max-w-lg w-full'>
              <Dialog.Title className='text-xl font-bold'>
                Plan Completed!
              </Dialog.Title>
              <Dialog.Description className='mt-2'>
                <p>Your diet plan has been created successfully.</p>
                <p>Click the button below to go back to the onboarding page.</p>
              </Dialog.Description>
              <Dialog.Close asChild>
                <Button
                  variant='outline'
                  className='mt-4'
                  onClick={handleResetAndBack}
                >
                  Go to Onboarding
                </Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

export default TimeToEat;
