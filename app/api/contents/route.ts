import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
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
      creator_id: user.id,
      tags,
      attachments,
      is_draft: isDraft || false,
    };

    // type別の追加データ
    const additionalData = type === 'knowledge' ? {} : {
      status,
      priority,
      assignee_id: assigneeId,
    };

    const { data: result, error } = await supabase
      .from(type === 'request' ? 'requests' : type === 'issue' ? 'issues' : 'knowledge')
      .insert([{ ...data, ...additionalData }])
      .select()
      .single();

    if (error) {
      console.error(error);
      return new NextResponse('Internal Error', { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[CONTENTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
