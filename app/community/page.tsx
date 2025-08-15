"use client"

import { useState } from "react"
import { CommunityPage } from "@/components/pages/community-page"
import { useCommunityPosts, useCreateCommunityPost } from "@/network/hooks"
import { CreateCommunityPostData } from "@/types/community"
import { toast } from "sonner"

export default function Community() {
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const { data: postsData, isLoading } = useCommunityPosts()
  const createPostMutation = useCreateCommunityPost()

  const handleCreatePost = async (data: CreateCommunityPostData) => {
    try {
      await createPostMutation.mutateAsync(data)
      setIsCreatingPost(false)
      toast.success("Post criado com sucesso!")
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  return (
    <CommunityPage
      posts={postsData?.data || []}
      isLoading={isLoading}
      onCreatePost={handleCreatePost}
      isCreatingPost={isCreatingPost}
      onToggleCreatePost={() => setIsCreatingPost(!isCreatingPost)}
    />
  )
}