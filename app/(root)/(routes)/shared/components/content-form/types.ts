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
  type: ContentType;
  // 下書き関連のフィールド
  draft_title?: string;
  draft_body?: string;
  draft_status?: string;
  draft_priority?: string;
  draft_assignee_id?: string;
  draft_tags?: string[];
  last_draft_saved_at?: string;
  is_draft?: boolean;
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
