import { useState } from 'react';
import { userSchema } from '../utils/scheme';
import z from 'zod';
import Input from '../shared/Input';

export default function UncontrolledForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const parsedData = userSchema.parse({
        ...formData,
        age: Number(formData.age) || 0,
      });

      setErrors({});
      console.log('Валидные данные:', parsedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path.length > 0 && typeof err.path[0] === 'string') {
            formattedErrors[err.path[0]] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  return (
    <div className="">
      <form onSubmit={handleSubmit} className=" max-w-md mx-auto rounded-2xl p-8 space-y-6 transition-all">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Uncontrolled Form</h2>
        </div>

        <div className="space-y-2">
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter your name"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <Input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter your age"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Отправить форму
        </button>
      </form>
    </div>
  );
}
