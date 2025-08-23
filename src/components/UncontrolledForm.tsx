import { useId, useState, type ChangeEvent, type FormEvent } from 'react';
import { userSchema } from '../utils/scheme';
import z from 'zod';
import Input from '../shared/Input';
import { useFormsStore, type Submission } from '../store/FormsStore';
import Select from '../shared/Select';
import type { Country } from '../store/CountryStore';
import useModalStore from '../store/ModalStore';

export default function UncontrolledForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { submitted } = useFormsStore((state) => state);
  const closeModal = useModalStore((state) => state.closeModal);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const id = useId();

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    const dataToValidate = {
      ...formValues,
      age: Number(formValues.age) || 0,
      acceptedTC: formValues.acceptedTC === 'on',
      image: imageFile,
    };

    try {
      const parsedData = userSchema.parse(dataToValidate);

      const submissionData: Submission = {
        id,
        origin: 'uncontrolled',
        createdAt: new Date().toISOString(),
        name: parsedData.name,
        age: parsedData.age,
        email: parsedData.email,
        password: parsedData.password,
        gender: parsedData.gender as 'male' | 'female' | 'other',
        acceptedTC: parsedData.acceptedTC,
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
      console.log('Валидные данные отправлены:', submissionData);
      setErrors({});
      e.currentTarget.reset();
      setImageFile(null);
      setBase64Image('');
      closeModal();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error);
        const formattedErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const path = issue.path[0];
          if (path) {
            formattedErrors[String(path)] = issue.message;
          }
        });
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto rounded-2xl p-8 space-y-6 transition-all" noValidate>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Uncontrolled Form</h2>
        </div>

        <div className="space-y-2">
          <Input
            type="text"
            name="name"
            error={errors.name}
            placeholder="Enter your name"
            autoComplete="given-name"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Input type="number" name="age" error={errors.age} placeholder="Enter your age" />
        </div>

        <div className="space-y-2">
          <Input type="email" autoComplete="email" name="email" error={errors.email} placeholder="Enter your email" />
        </div>

        <div className="space-y-2">
          <Input
            type="password"
            name="password"
            error={errors.password}
            placeholder="Enter your password"
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <Input
            type="password"
            name="passwordConfirm"
            error={errors.passwordConfirm}
            placeholder="Confirm your password"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Gender:</p>
          <div className="flex gap-4">
            <Input label="Male" type="radio" name="gender" value="male" className="size-4" />
            <Input label="Female" type="radio" name="gender" value="female" className="size-4" />
            <Input label="Other" type="radio" name="gender" value="other" className="size-4" defaultChecked />
          </div>
          {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
        </div>

        <div className="space-y-2">
          <Select error={errors.country} onSelect={setSelectedCountry} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Profile Image (PNG or JPEG)</label>
          <input
            type="file"
            name="image"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {errors.image && <span className="text-red-500 text-sm">{errors.image}</span>}
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="acceptedTC" name="acceptedTC" className="size-4" />
          <label htmlFor="acceptedTC" className="text-sm text-gray-700">
            I accept the Terms and Conditions
          </label>
        </div>
        {errors.acceptedTC && <span className="text-red-500 text-sm">{errors.acceptedTC}</span>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Send Form
        </button>
      </form>
    </div>
  );
}
