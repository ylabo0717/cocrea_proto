import { useCallback, useEffect, useRef, useState } from 'react';
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
  type: 'request',
  draft_title: '',
  draft_body: '',
  draft_status: 'open',
  draft_priority: 'medium',
  draft_assignee_id: '',
  draft_tags: [],
  is_draft: true,
};

interface UseContentFormProps {
  initialData?: Partial<ContentFormData>;
  contentId?: string;
  onAutoSave?: (data: ContentFormData) => Promise<void>;
}

export const useContentForm = ({
  initialData,
  contentId,
  onAutoSave,
}: UseContentFormProps) => {
  const [formData, setFormData] = useState<ContentFormData>({
    ...defaultFormData,
    ...initialData,
  });

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const isSubmittingRef = useRef(false);

  const handleChange = useCallback(
    (field: keyof ContentFormData, value: any) => {
      setFormData((prev) => {
        const newData = {
          ...prev,
          [field]: value,
        };

        // 下書きフィールドも更新
        if (prev.is_draft) {
          switch (field) {
            case 'title':
              newData.draft_title = value;
              break;
            case 'body':
              newData.draft_body = value;
              break;
            case 'status':
              newData.draft_status = value;
              break;
            case 'priority':
              newData.draft_priority = value;
              break;
            case 'assigneeId':
              newData.draft_assignee_id = value;
              break;
            case 'tags':
              newData.draft_tags = value;
              break;
          }
          newData.last_draft_saved_at = new Date().toISOString();
        }

        return newData;
      });
    },
    []
  );

  const handleAutoSave = useCallback(
    async (data: ContentFormData) => {
      if (!contentId || !onAutoSave || isSubmittingRef.current) return;

      try {
        await onAutoSave(data);
      } catch (error) {
        console.error('下書き保存エラー:', error);
      }
    },
    [contentId, onAutoSave]
  );

  useEffect(() => {
    if (!contentId || !onAutoSave) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      handleAutoSave(formData);
    }, 2000); // 2秒後に保存

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, contentId, onAutoSave, handleAutoSave]);

  const validateForm = () => {
    if (!formData.title.trim()) return false;
    if (!formData.body.trim()) return false;
    if (!formData.applicationId) return false;
    return true;
  };

  // 下書きが空かどうかをチェックする
  const isDraftEmpty = () => {
    return (
      !formData.draft_title?.trim() &&
      !formData.draft_body?.trim() &&
      formData.draft_status === 'open' &&
      formData.draft_priority === 'medium' &&
      (!formData.draft_tags || formData.draft_tags.length === 0)
    );
  };

  // キャンセル時に空の下書きを削除する
  const handleCancel = async () => {
    if (contentId && formData.is_draft && isDraftEmpty()) {
      try {
        await fetch(`/api/contents/${contentId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Failed to delete empty draft:', error);
      }
    }
    setFormData(defaultFormData);
  };

  return {
    formData,
    handleChange,
    validateForm,
    handleCancel,
    setSubmitting: (submitting: boolean) => {
      isSubmittingRef.current = submitting;
    },
  };
};
