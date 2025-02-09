import { Metadata } from "next"
import { ContentType, fetchUserContentCounts, fetchUserContents, fetchContributionData } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ContentList } from "./components/content-list"
import { ContributionGraph } from "./components/contribution-graph"
import { contentTypeInfo } from "./constants"

export const metadata: Metadata = {
  title: "マイページ",
  description: "投稿の管理や設定を行うことができます",
}

export default async function MyPage({searchParams}: {searchParams: { [key: string]: string | string[] | undefined }}) {
  const counts = await fetchUserContentCounts()
  const selectedType = searchParams.type as ContentType | undefined
  const contributions = await fetchContributionData()
  
  let contents = []
  if (selectedType && selectedType in contentTypeInfo) {
    contents = await fetchUserContents(selectedType)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">マイページ</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>投稿履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <ContributionGraph contributions={contributions} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(contentTypeInfo).map(([type, info]) => (
          <Link key={type} href={`/mypage?type=${type}`} className="transition-transform hover:scale-105">
            <Card className={selectedType === type ? 'ring-2 ring-primary' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {info.label}
                </CardTitle>
                <info.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{counts?.[type as ContentType] ?? 0}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {selectedType && contents.length > 0 && (
        <ContentList type={selectedType} contents={contents} />
      )}
    </div>
  )
}
