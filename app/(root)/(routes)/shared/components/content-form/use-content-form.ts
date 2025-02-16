import { useState } from 'react';
import { ContentFormData } from './types';

const defaultFormData: ContentFormData = {
  title: '',
  body: '',
  applicationId: '',
  status: 'open',
  priority: 'medium',
  assigneeId: '',
  tags: [],
  attachments: [],
  type: 'request'
};

export const useContentForm = (initialData?: Partial<ContentFormData>) => {
  const [formData, setFormData] = useState<ContentFormData>({
    ...defaultFormData,
    ...initialData,
  });

  const handleChange = (field: keyof ContentFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return false;
    if (!formData.body.trim()) return false;
    if (!formData.applicationId) return false;
    return true;
  };

  const handleCancel = () => {
    setFormData(defaultFormData);
  };

  return {
    formData,
    handleChange,
    validateForm,
    handleCancel,
  };
};
