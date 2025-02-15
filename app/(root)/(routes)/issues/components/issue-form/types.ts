export interface IssueFormData {
  id?: string;
  title: string;
  body: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  application_id: string;
  assignee_id?: string;
  // 下書き関連のフィールド
  draft_title?: string;
  draft_body?: string;
  draft_status?: 'open' | 'in_progress' | 'resolved';
  draft_priority?: 'low' | 'medium' | 'high';
  draft_tags?: string[];
  last_draft_saved_at?: string;
}

export interface IssueFormProps {
  initialData?: Partial<IssueFormData>;
  onSubmit: (data: IssueFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  tempId?: string;
  // 下書き関連のプロップ
  onSaveDraft?: (data: IssueFormData) => Promise<void>;
  onPublishDraft?: () => Promise<void>;
  isDraft?: boolean;
}