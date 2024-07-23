import { useState } from 'react';
import { Input } from '@/components/ui/Input.jsx';
import { Label } from '@/components/ui/Label.jsx';
import { Button } from '@/components/ui/Button.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails, setBMIandTDEE } from '@/redux/reducer';
import axios from 'axios';
import { z } from 'zod';

const ageSchema = z
  .string()
  .refine(value => !isNaN(value) && parseInt(value) > 0, {
    message: 'Age must be a positive number',
  });
const weightSchema = z
  .string()
  .refine(value => !isNaN(value) && parseInt(value) > 0, {
    message: 'Weight must be a positive number',
  });
const heightSchema = z
  .string()
  .refine(value => !isNaN(value) && parseInt(value) > 0, {
    message: 'Height must be a positive number',
  });
const genderSchema = z.enum(['Male', 'Female']);
const activityLevelSchema = z.enum([
  'Sedentary',
  'Lightly',
  'Moderately',
  'Very-active',
  'Extra-active',
]);
const numberOfMealsPerDaySchema = z.enum(['3', '5']);

const onboardingSchema = z.object({
  age: ageSchema,
  weight: weightSchema,
  height: heightSchema,
  gender: genderSchema,
  activityLevel: activityLevelSchema,
  numberOfMealsPerDay: numberOfMealsPerDaySchema,
});

function Onboarding() {
  const userDetails = useSelector(state => state.user);
  const [age, setAge] = useState(userDetails.age || '22');
  const [weight, setWeight] = useState(userDetails.weight || '60');
  const [height, setHeight] = useState(userDetails.height || '170');
  const [gender, setGender] = useState(userDetails.gender || 'Male');
  const [activityLevel, setActivityLevel] = useState(
    userDetails.activityLevel || 'Sedentary'
  );
  const [numberOfMealsPerDay, setNumberOfMealsPerDay] = useState(
    userDetails.numberOfMealsPerDay || '3'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNextClick = async () => {
    const formData = {
      age,
      weight,
      height,
      gender,
      activityLevel,
      numberOfMealsPerDay,
    };

    const validation = onboardingSchema.safeParse(formData);

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setError(null);
    setLoading(true);

    dispatch(setUserDetails(formData));

    const startTime = Date.now();

    try {
      const response = await axios.post(
        `http://103.217.145.107:8000/tdee-bmi`,
        {
          age: parseInt(age),
          weight: parseInt(weight),
          height: parseInt(height),
          gender: gender.toLowerCase(),
          activity_level: activityLevel.toLowerCase(),
        }
      );

      const { BMI, TDEE, BMIStatus } = response.data;
      dispatch(setBMIandTDEE({ bmi: BMI, tdee: TDEE, bmiStatus: BMIStatus }));

      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 1000; // Minimum loading time of 1 second

      if (elapsedTime < minLoadingTime) {
        setTimeout(() => {
          setLoading(false);
          navigate('/favourite-food');
        }, minLoadingTime - elapsedTime);
      } else {
        setLoading(false);
        navigate('/favourite-food');
      }
    } catch (error) {
      console.error('Error calculating BMI and TDEE:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className='text-3xl font-sans font-bold mb-4'>Welcome!</h2>
      <p className={'font-sans text-sm font-medium'} style={{ color: '#000' }}>
        Enter your Age, Weight, Gender, Activity Level, and Number of meals per
        day so we can suggest a suitable diet for you.
      </p>
      {error && <p className='text-red-500'>{error}</p>}

      <div className='form-responsive'>
        <div className='grid mt-10 w-full items-center mr-6'>
          <Label htmlFor='umur' className='mb-4'>
            Age
          </Label>
          <Input
            type='number'
            id='age'
            placeholder='Enter your age'
            value={age}
            onChange={e => setAge(e.currentTarget.value)}
          />
        </div>
        <div className='grid mt-10 w-full items-center'>
          <Label htmlFor='weight' className='mb-4'>
            Weight
          </Label>
          <Input
            type='number'
            id='weight'
            placeholder='Enter your weight'
            value={weight}
            onChange={e => setWeight(e.currentTarget.value)}
          />
        </div>
      </div>
      <div className='form-responsive'>
        <div className='grid mt-10 w-full items-center mr-6'>
          <Label htmlFor='height' className='mb-4'>
            Height
          </Label>
          <Input
            type='number'
            id='height'
            placeholder='Enter your height'
            value={height}
            onChange={e => setHeight(e.currentTarget.value)}
          />
        </div>
        <div className='grid mt-10 w-full items-center'>
          <Label className='mb-4'>Gender</Label>
          <Select
            className='w-full'
            value={gender}
            onValueChange={e => setGender(e)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select gender' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='Male'>Male</SelectItem>
                <SelectItem value='Female'>Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='form-responsive'>
        <div className='grid mt-10 w-full items-center'>
          <Label htmlFor='activityLevel' className='mb-4'>
            Activity level
          </Label>
          <Select
            className='w-full'
            value={activityLevel}
            onValueChange={e => setActivityLevel(e)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select activity level' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='Sedentary'>Sedentary</SelectItem>
                <SelectItem value='Lightly'>Lightly</SelectItem>
                <SelectItem value='Moderately'>Moderately</SelectItem>
                <SelectItem value='Very-active'>Very Active</SelectItem>
                <SelectItem value='Extra-active'>Extra Active</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <div className='grid mt-10 w-full items-center'>
          <Label className='mb-4'>Number of Meals per Day</Label>
          <Select
            className='w-full'
            value={numberOfMealsPerDay}
            onValueChange={e => setNumberOfMealsPerDay(e)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select number of meals' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='3'>3</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='mt-10 text-right'>
        <Button
          className='rounded-full bg-black px-10'
          onClick={handleNextClick}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Next'}
        </Button>
      </div>
    </>
  );
}

export default Onboarding;
