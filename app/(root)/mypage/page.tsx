import { Metadata } from "next"

export const metadata: Metadata = {
  title: "マイページ",
  description: "投稿の管理や設定を行うことができます",
}

export default function MyPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">マイページ</h2>
      </div>
      <div className="hidden md:block">
        {/* ここに投稿一覧などのコンテンツを追加予定 */}
      </div>
    </div>
  )
}
