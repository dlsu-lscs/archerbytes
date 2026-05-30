import UserArticleItem from "../molecules/UserArticleItem"

export default function UserArticles() {
  return (
    <div className="flex flex-col gap-5 px-7 md:px-10 py-5 md:py-0">
      <p className="text-[#25609F] font-bold text-3xl">Featured Articles</p>
      <UserArticleItem />
      <UserArticleItem />
      <UserArticleItem />
      <UserArticleItem />
    </div>
  )
}