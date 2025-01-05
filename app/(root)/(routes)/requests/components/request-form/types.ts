export interface RequestFormData {
  id?: string;
  title: string;
  body: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  application_id: string;
  assignee_id?: string;
}

export interface RequestFormProps {
  initialData?: Partial<RequestFormData>;
  onSubmit: (data: RequestFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  tempId?: string;
}