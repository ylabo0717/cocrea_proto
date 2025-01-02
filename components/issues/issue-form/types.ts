export interface IssueFormData {
  id?: string;
  title: string;
  body: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  application_id: string;
  assignee_id?: string;
}

export interface IssueFormProps {
  initialData?: Partial<IssueFormData>;
  onSubmit: (data: IssueFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  tempId?: string;
}