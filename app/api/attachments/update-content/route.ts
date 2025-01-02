import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { oldContentId, newContentId } = await req.json();

    const { error } = await supabase
      .from('attachments')
      .update({ content_id: newContentId })
      .eq('content_id', oldContentId);

    if (error) {
      console.error('Error updating attachments:', error);
      return NextResponse.json(
        { error: 'Failed to update attachments' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}