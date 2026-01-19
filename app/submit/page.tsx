// app/submit/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  MapPin,
  FileText,
  User,
  Loader2,
  Camera,
  AlertCircle,
  CheckCircle2,
  Shield,
  Phone,
  Home,
  Building,
  Sparkles,
  Send,
  ImageIcon,
} from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';
import { submitProblem, uploadImage } from '@/lib/api';
import { cn, toBanglaNumber } from '@/lib/utils';

// Form Data Type
interface FormData {
  title: string;
  description: string;
  category: string;
  upazila: string;
  union_name: string;
  ward: string;
  address_details: string;
  submitter_name: string;
  submitter_phone: string;
  images: string[];
}

// Initial Form State
const initialFormData: FormData = {
  title: '',
  description: '',
  category: '',
  upazila: '',
  union_name: '',
  ward: '',
  address_details: '',
  submitter_name: '',
  submitter_phone: '',
  images: [],
};

// Category Icons
const categoryIcons: Record<string, string> = {
  roads: '🛣️',
  water: '💧',
  electricity: '⚡',
  education: '📚',
  health: '🏥',
  agriculture: '🌾',
  environment: '🌳',
  other: '📋',
};

export default function SubmitPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { categories, upazilas, getUnionsByUpazila, loading: settingsLoading } = useSettings();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Get unions based on selected upazila
  const availableUnions = formData.upazila ? getUnionsByUpazila(formData.upazila) : [];

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'upazila') {
      setFormData((prev) => ({ ...prev, union_name: '' }));
    }
    
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 5 - imageFiles.length;
    const newFiles = files.slice(0, remainingSlots);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...newFiles]);
  };

  // Remove image
  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!formData.category) newErrors.category = 'সমস্যার ধরন নির্বাচন করুন';
      if (!formData.title.trim()) newErrors.title = 'শিরোনাম লিখুন';
      else if (formData.title.trim().length < 10) newErrors.title = 'শিরোনাম কমপক্ষে ১০ অক্ষর হতে হবে';
      if (!formData.description.trim()) newErrors.description = 'বিস্তারিত বর্ণনা লিখুন';
      else if (formData.description.trim().length < 30) newErrors.description = 'বিস্তারিত কমপক্ষে ৩০ অক্ষর হতে হবে';
    }

    if (step === 2) {
      if (!formData.upazila) newErrors.upazila = 'উপজেলা নির্বাচন করুন';
      if (!formData.union_name) newErrors.union_name = 'ইউনিয়ন নির্বাচন করুন';
    }

    if (step === 3) {
      if (!formData.submitter_name.trim()) newErrors.submitter_name = 'আপনার নাম লিখুন';
      if (!formData.submitter_phone.trim()) newErrors.submitter_phone = 'মোবাইল নম্বর লিখুন';
      else if (!/^01[3-9]\d{8}$/.test(formData.submitter_phone.replace(/\s|-/g, ''))) {
        newErrors.submitter_phone = 'সঠিক মোবাইল নম্বর লিখুন (01XXXXXXXXX)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setSubmitting(true);

    try {
      let uploadedUrls: string[] = [];
      if (imageFiles.length > 0) {
        setUploading(true);
        uploadedUrls = await Promise.all(imageFiles.map((file) => uploadImage(file)));
        setUploading(false);
      }

      await submitProblem({
        ...formData,
        images: uploadedUrls,
        status: 'pending',
        votes_count: 0,
        views_count: 0,
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Submit error:', error);
      alert('সমস্যা জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  // Success Screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-green-100 rounded-full -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-100 rounded-full translate-x-20 translate-y-20" />
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ধন্যবাদ! 🎉
              </h1>
              
              <p className="text-lg text-gray-600 mb-3">
                আপনার সমস্যাটি সফলভাবে জমা হয়েছে।
              </p>
              
              <p className="text-gray-500 mb-8">
                আমরা শীঘ্রই এটি পর্যালোচনা করে প্রয়োজনীয় পদক্ষেপ নেব।
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/problems"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-200 hover:shadow-xl"
                >
                  সব সমস্যা দেখুন
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
                >
                  <Home className="w-5 h-5" />
                  হোমে ফিরুন
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
          <p className="text-gray-600 font-medium">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Top Navigation */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">ফিরে যান</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">সমস্যা জমা</span>
            </div>
            
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-10 max-w-2xl">
        {/* Progress Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                ধাপ {toBanglaNumber(currentStep)}/{toBanglaNumber(totalSteps)}
              </span>
              <span className="text-sm font-medium text-green-600">
                {toBanglaNumber(Math.round(progress))}% সম্পূর্ণ
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'সমস্যার বিবরণ', icon: FileText },
              { step: 2, label: 'এলাকার তথ্য', icon: MapPin },
              { step: 3, label: 'আপনার তথ্য', icon: User },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                      currentStep > item.step
                        ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                        : currentStep === item.step
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 scale-110'
                        : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    {currentStep > item.step ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <item.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs mt-2 font-medium text-center hidden sm:block',
                      currentStep >= item.step ? 'text-green-600' : 'text-gray-400'
                    )}
                  >
                    {item.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={cn(
                      'w-12 md:w-20 h-1 mx-2 rounded-full transition-all duration-300',
                      currentStep > item.step ? 'bg-green-500' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Step 1: Problem Details */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">সমস্যার বিবরণ দিন</h2>
                  <p className="text-gray-500 mt-2">আপনার এলাকার সমস্যাটি বিস্তারিত জানান</p>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    সমস্যার ধরন নির্বাচন করুন <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, category: cat.value }));
                          setErrors((prev) => ({ ...prev, category: '' }));
                        }}
                        className={cn(
                          'relative p-4 rounded-2xl border-2 text-center transition-all duration-200 hover:scale-105',
                          formData.category === cat.value
                            ? 'border-green-500 bg-green-50 shadow-lg shadow-green-100'
                            : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                        )}
                      >
                        {formData.category === cat.value && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <span className="text-2xl mb-2 block">
                          {categoryIcons[cat.value] || '📋'}
                        </span>
                        <span className={cn(
                          'text-sm font-medium',
                          formData.category === cat.value ? 'text-green-700' : 'text-gray-600'
                        )}>
                          {cat.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="mt-3 text-sm text-red-500 flex items-center gap-2 bg-red-50 p-3 rounded-xl">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    সমস্যার শিরোনাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="উদাহরণ: রাস্তায় বড় গর্ত, বিপজ্জনক অবস্থা"
                    className={cn(
                      'w-full px-5 py-4 rounded-2xl border-2 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400',
                      errors.title
                        ? 'border-red-300 focus:border-red-500 bg-red-50/50'
                        : 'border-gray-200 focus:border-green-500 focus:bg-green-50/30'
                    )}
                  />
                  <div className="flex justify-between mt-2">
                    {errors.title ? (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className={cn(
                      'text-xs',
                      formData.title.length < 10 ? 'text-gray-400' : 'text-green-600'
                    )}>
                      {toBanglaNumber(formData.title.length)}/১০+ অক্ষর
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    বিস্তারিত বর্ণনা <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="সমস্যাটি কখন থেকে আছে, কতটুকু এলাকা জুড়ে, কারা ক্ষতিগ্রস্ত হচ্ছেন - বিস্তারিত লিখুন..."
                    className={cn(
                      'w-full px-5 py-4 rounded-2xl border-2 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none',
                      errors.description
                        ? 'border-red-300 focus:border-red-500 bg-red-50/50'
                        : 'border-gray-200 focus:border-green-500 focus:bg-green-50/30'
                    )}
                  />
                  <div className="flex justify-between mt-2">
                    {errors.description ? (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.description}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className={cn(
                      'text-xs',
                      formData.description.length < 30 ? 'text-gray-400' : 'text-green-600'
                    )}>
                      {toBanglaNumber(formData.description.length)}/৩০+ অক্ষর
                    </span>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ছবি যোগ করুন 
                    <span className="text-gray-400 font-normal ml-2">(ঐচ্ছিক, সর্বোচ্চ ৫টি)</span>
                  </label>
                  
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group shadow-md">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="absolute bottom-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {imageFiles.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-green-400 hover:bg-green-50/50 transition-all group"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-green-100 group-hover:scale-110 transition-all">
                          <Camera className="w-8 h-8 text-gray-400 group-hover:text-green-600" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-600 group-hover:text-green-600">
                            ছবি আপলোড করুন
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            ক্লিক করুন বা ড্র্যাগ করে ছাড়ুন
                          </p>
                        </div>
                      </div>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location Details */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">এলাকার তথ্য দিন</h2>
                  <p className="text-gray-500 mt-2">সমস্যাটি কোথায় সেটি জানান</p>
                </div>

                {/* Upazila */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      উপজেলা <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      name="upazila"
                      value={formData.upazila}
                      onChange={handleChange}
                      className={cn(
                        'w-full px-5 py-4 rounded-2xl border-2 focus:outline-none transition-all appearance-none bg-white cursor-pointer text-gray-900',
                        errors.upazila
                          ? 'border-red-300 focus:border-red-500'
                          : formData.upazila
                          ? 'border-green-500 bg-green-50/30'
                          : 'border-gray-200 focus:border-green-500'
                      )}
                    >
                      <option value="">উপজেলা নির্বাচন করুন</option>
                      {upazilas.map((upazila) => (
                        <option key={upazila.value} value={upazila.value}>
                          {upazila.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.upazila && (
                    <p className="mt-3 text-sm text-red-500 flex items-center gap-2 bg-red-50 p-3 rounded-xl">
                      <AlertCircle className="w-4 h-4" />
                      {errors.upazila}
                    </p>
                  )}
                </div>

                {/* Union */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-gray-500" />
                      ইউনিয়ন <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      name="union_name"
                      value={formData.union_name}
                      onChange={handleChange}
                      disabled={!formData.upazila}
                      className={cn(
                        'w-full px-5 py-4 rounded-2xl border-2 focus:outline-none transition-all appearance-none cursor-pointer',
                        !formData.upazila
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          : errors.union_name
                          ? 'border-red-300 focus:border-red-500 bg-white'
                          : formData.union_name
                          ? 'border-green-500 bg-green-50/30'
                          : 'border-gray-200 focus:border-green-500 bg-white'
                      )}
                    >
                      <option value="">
                        {formData.upazila ? 'ইউনিয়ন নির্বাচন করুন' : '← আগে উপজেলা নির্বাচন করুন'}
                      </option>
                      {availableUnions.map((union) => (
                        <option key={union.value} value={union.value}>
                          {union.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.union_name && (
                    <p className="mt-3 text-sm text-red-500 flex items-center gap-2 bg-red-50 p-3 rounded-xl">
                      <AlertCircle className="w-4 h-4" />
                      {errors.union_name}
                    </p>
                  )}
                </div>

                {/* Ward */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ওয়ার্ড নং <span className="text-gray-400 font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    placeholder="যেমন: ৩"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Address Details */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    বিস্তারিত ঠিকানা <span className="text-gray-400 font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <textarea
                    name="address_details"
                    value={formData.address_details}
                    onChange={handleChange}
                    rows={3}
                    placeholder="গ্রাম/মহল্লার নাম, নিকটবর্তী স্থান, রাস্তার নাম ইত্যাদি..."
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Personal Info */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">আপনার তথ্য দিন</h2>
                  <p className="text-gray-500 mt-2">প্রয়োজনে যোগাযোগের জন্য</p>
                </div>

                {/* Privacy Notice */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">আপনার গোপনীয়তা সুরক্ষিত</p>
                      <p className="text-sm text-blue-700 mt-1">
                        আপনার ব্যক্তিগত তথ্য শুধুমাত্র আমাদের কাছে থাকবে এবং প্রয়োজনে যোগাযোগের জন্য ব্যবহার হবে।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      আপনার নাম <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="submitter_name"
                    value={formData.submitter_name}
                    onChange={handleChange}
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    className={cn(
                      'w-full px-5 py-4 rounded-2xl border-2 focus:outline-none transition-all',
                      errors.submitter_name
                        ? 'border-red-300 focus:border-red-500 bg-red-50/50'
                        : 'border-gray-200 focus:border-green-500'
                    )}
                  />
                  {errors.submitter_name && (
                    <p className="mt-3 text-sm text-red-500 flex items-center gap-2 bg-red-50 p-3 rounded-xl">
                      <AlertCircle className="w-4 h-4" />
                      {errors.submitter_name}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      মোবাইল নম্বর <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <input
                    type="tel"
                    name="submitter_phone"
                    value={formData.submitter_phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className={cn(
                      'w-full px-5 py-4 rounded-2xl border-2 focus:outline-none transition-all',
                      errors.submitter_phone
                        ? 'border-red-300 focus:border-red-500 bg-red-50/50'
                        : 'border-gray-200 focus:border-green-500'
                    )}
                  />
                  {errors.submitter_phone && (
                    <p className="mt-3 text-sm text-red-500 flex items-center gap-2 bg-red-50 p-3 rounded-xl">
                      <AlertCircle className="w-4 h-4" />
                      {errors.submitter_phone}
                    </p>
                  )}
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-gray-900">জমা দেওয়ার আগে যাচাই করুন</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">{categoryIcons[formData.category] || '📋'}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500">সমস্যার ধরন</p>
                        <p className="font-medium text-gray-900">
                          {categories.find((c) => c.value === formData.category)?.label || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500">শিরোনাম</p>
                        <p className="font-medium text-gray-900 truncate">{formData.title || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500">এলাকা</p>
                        <p className="font-medium text-gray-900">
                          {upazilas.find((u) => u.value === formData.upazila)?.label || '-'}
                          {formData.union_name && `, ${availableUnions.find((u) => u.value === formData.union_name)?.label || ''}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500">ছবি</p>
                        <p className="font-medium text-gray-900">{toBanglaNumber(imageFiles.length)}টি ছবি যোগ করা হয়েছে</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="px-6 md:px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
                currentStep === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200 active:scale-95'
              )}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">পেছনে</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-200 active:scale-95"
              >
                পরবর্তী
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {uploading ? 'ছবি আপলোড হচ্ছে...' : 'জমা হচ্ছে...'}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    জমা দিন
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Help Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            কোনো সমস্যা হলে কল করুন:{' '}
            <a href="tel:+8801700000000" className="text-green-600 font-semibold hover:underline">
              ০১৭০০-০০০০০০
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}