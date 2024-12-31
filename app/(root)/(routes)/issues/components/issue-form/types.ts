export interface IssueFormData {
  title: string;
  body: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  application_id: string;
}

export interface IssueFormProps {
  initialData?: Partial<IssueFormData>;
  onSubmit: (data: IssueFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}