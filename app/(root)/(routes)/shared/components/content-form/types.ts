export type ContentType = 'request' | 'issue' | 'knowledge';

export interface ContentFormData {
  id?: string;
  title: string;
  body: string;
  applicationId: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  tags: string[];
  attachments: string[];
  tempId?: string;
  isDraft?: boolean;
  type: ContentType;
}

export interface ContentFormProps {
  initialData?: Partial<ContentFormData>;
  onSubmit: (data: ContentFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  tempId?: string;
  onSaveDraft?: () => Promise<void>;
  onPublishDraft?: () => Promise<void>;
  isDraft?: boolean;
  contentType: ContentType;
}
