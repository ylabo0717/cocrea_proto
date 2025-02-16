import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const json = await req.json();
    const {
      title,
      body,
      applicationId,
      status,
      priority,
      assigneeId,
      tags,
      attachments,
      type,
      isDraft
    } = json;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = {
      title,
      body,
      application_id: applicationId,
      tags,
      attachments,
      is_draft: isDraft,
    };

    // type別の追加データ
    const additionalData = type === 'knowledge' ? {} : {
      status,
      priority,
      assignee_id: assigneeId,
    };

    const { data: result, error } = await supabase
      .from(type === 'request' ? 'requests' : type === 'issue' ? 'issues' : 'knowledge')
      .update({ ...data, ...additionalData })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return new NextResponse('Internal Error', { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[CONTENTS_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
