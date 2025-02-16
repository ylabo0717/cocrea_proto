export interface KnowledgeFormData {
  id?: string;
  title: string;
  body: string;
  tags?: string[];
  application_id: string;
}

export interface KnowledgeFormProps {
  initialData?: Partial<KnowledgeFormData>;
  onSubmit: (data: KnowledgeFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  tempId?: string;
}