export interface KnowledgeFormData {
  id?: string;
  title: string;
  body: string;
  status: string;
  tags?: string[];
  application_id: string;
  // 下書き関連のフィールド
  draft_title?: string;
  draft_body?: string;
  draft_tags?: string[];
  last_draft_saved_at?: string;
}

export interface KnowledgeFormProps {
  initialData?: Partial<KnowledgeFormData>;
  onSubmit: (data: KnowledgeFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  tempId?: string;
  // 下書き関連のプロップ
  onSaveDraft?: (data: KnowledgeFormData) => Promise<void>;
  onPublishDraft?: () => Promise<void>;
  isDraft?: boolean;
}