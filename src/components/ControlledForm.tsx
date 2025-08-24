import { useState, type ChangeEvent } from 'react';
import { userSchema } from '../utils/scheme';
import Input from '../shared/Input';
import { useForm, type FieldValues } from 'react-hook-form';
import { useFormsStore, type Submission } from '../store/FormsStore';
import Select from '../shared/Select';
import type { Country } from '../store/CountryStore';
import useModalStore from '../store/ModalStore';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ControlledForm() {
  const submitted = useFormsStore((state) => state.submitted);
  const closeModal = useModalStore((state) => state.closeModal);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: 'onBlur', resolver: zodResolver(userSchema) });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBase64Image('');
    }
  };

  const onSubmit = (data: FieldValues) => {
    try {
      const submissionData: Submission = {
        id: crypto.randomUUID(),
        origin: 'controlled',
        createdAt: new Date().toISOString(),
        name: data.name,
        age: data.age,
        email: data.email,
        password: data.password,
        gender: data.gender as 'male' | 'female' | 'other',
        acceptedTC: data.acceptedTC,
        country: selectedCountry ?? { code: 'RU', name: 'Russia' },
        image: imageFile
          ? {
              base64: base64Image ?? '',
              mime: imageFile.type.startsWith('image/png') ? 'image/png' : 'image/jpeg',
              size: imageFile.size,
            }
          : {
              base64: '',
              mime: 'image/png',
              size: 0,
            },
      };
      submitted(submissionData);
      setImageFile(null);
      setBase64Image('');
      reset();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto rounded-2xl p-8 space-y-6 transition-all">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Controlled Form</h2>
        </div>

        <div className="space-y-2">
          <Input
            {...register('name')}
            type="text"
            name="name"
            error={errors.name?.message}
            placeholder="Enter your name"
            autoComplete="given-name"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Input
            {...register('age')}
            type="number"
            name="age"
            error={errors.age?.message}
            placeholder="Enter your age"
          />
        </div>

        <div className="space-y-2">
          <Input
            {...register('email')}
            type="email"
            autoComplete="off"
            name="email"
            error={errors.email?.message}
            placeholder="Enter your emаil"
          />
        </div>

        <div className="space-y-2">
          <Input
            {...register('password')}
            type="password"
            error={errors.password?.message}
            placeholder="Enter your password"
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <Input
            {...register('passwordConfirm')}
            type="password"
            error={errors.passwordConfirm?.message}
            placeholder="Confirm your password"
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Gender:</p>
          <div className="flex gap-4">
            <Input {...register('gender')} label="Male" type="radio" name="gender" value="male" className="size-4" />
            <Input
              {...register('gender')}
              label="Female"
              type="radio"
              name="gender"
              value="female"
              className="size-4"
            />
            <Input
              {...register('gender')}
              label="Other"
              type="radio"
              name="gender"
              value="other"
              className="size-4"
              defaultChecked
            />
          </div>
          {errors.gender && (
            <span className="text-red-500 text-sm font-medium flex items-center">{errors.gender.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Select {...register('country')} error={errors.country?.message} onSelect={setSelectedCountry} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Profile Image (PNG or JPEG)</label>
          <input
            {...register('image')}
            type="file"
            name="image"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {errors.image && (
            <span className="text-red-500 text-sm font-medium flex items-center">{errors.image.message}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input {...register('acceptedTC')} type="checkbox" id="acceptedTC" name="acceptedTC" className="size-4" />
          <label htmlFor="acceptedTC" className="text-sm text-gray-700">
            I accept the Terms and Conditions
          </label>
        </div>
        {errors.acceptedTC && (
          <span className="text-red-500 text-sm font-medium flex items-center">{errors.acceptedTC.message}</span>
        )}

        <button
          disabled={!isValid}
          type="submit"
          className="w-full bg-gradient-to-r disabled:from-gray-600 disabled:to-gray-900 disabled:cursor-not-allowed disabled:hover:translate-0 from-blue-600 to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Send Form
        </button>
      </form>
    </div>
  );
}
