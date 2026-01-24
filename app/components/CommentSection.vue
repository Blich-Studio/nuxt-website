<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Button from './ui/Button.vue'
import Textarea from './ui/Textarea.vue'
import type { Comment as ApiComment } from '~/types/api'

interface DisplayComment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
  likes: number
  isLiked: boolean
  replies?: DisplayComment[]
}

function transformComment(comment: ApiComment): DisplayComment {
  return {
    id: comment.id,
    userId: comment.userId,
    userName: comment.user?.displayName || 'Anonymous',
    userAvatar: comment.user?.avatarUrl ?? undefined,
    content: comment.content,
    createdAt: comment.createdAt,
    likes: comment.likesCount,
    isLiked: comment.isLiked || false,
    replies: comment.replies?.map(transformComment),
  }
}

const props = defineProps<{ contentType: 'project' | 'article'; contentId: string }>()

const { user, showAuthModal, initialized, fetchUser } = useAuth()
const { getComments: getArticleComments, addComment: addArticleComment, likeComment: likeArticleComment, unlikeComment: unlikeArticleComment } = useArticles()
const { getComments: getProjectComments, addComment: addProjectComment, likeComment: likeProjectComment, unlikeComment: unlikeProjectComment } = useProjects()

const comments = ref<DisplayComment[]>([])
const newComment = ref('')
const replyingTo = ref<string | null>(null)
const replyContent = ref('')
const isLoading = ref(true)
const isSubmitting = ref(false)
const likingCommentId = ref<string | null>(null)
const error = ref<string | null>(null)

onMounted(() => {
  loadComments()
})

async function loadComments() {
  isLoading.value = true
  error.value = null
  
  try {
    let result
    if (props.contentType === 'article') {
      result = await getArticleComments(props.contentId)
    } else {
      result = await getProjectComments(props.contentId)
    }
    comments.value = result.comments.map(transformComment)
  } catch (e: any) {
    console.error('Failed to load comments:', e)
    error.value = e.message || 'Failed to load comments'
    comments.value = []
  } finally {
    isLoading.value = false
  }
}

function formatDate(date: string) {
  const now = new Date()
  const commentDate = new Date(date)
  const diffInHours = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60 * 60))
  if (diffInHours < 24) {
    if (diffInHours < 1) return 'Just now'
    return `${diffInHours}h ago`
  }
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  return commentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

async function handleSubmitComment() {
  // Ensure auth is initialized
  if (!initialized.value) {
    await fetchUser(true)
  }

  if (!user.value?.userId) {
    showAuthModal()
    return
  }
  if (!newComment.value.trim()) return

  isSubmitting.value = true

  try {
    let result
    if (props.contentType === 'article') {
      result = await addArticleComment(props.contentId, newComment.value)
    } else {
      result = await addProjectComment(props.contentId, newComment.value)
    }

    // Add new comment to the top of the list
    const displayComment = transformComment(result)
    displayComment.userName = user.value.name || user.value.email
    comments.value = [displayComment, ...comments.value]
    newComment.value = ''
  } catch (e: any) {
    console.error('Failed to post comment:', e)
    // Show error to user
    alert(e.message || 'Failed to post comment')
  } finally {
    isSubmitting.value = false
  }
}

async function handleSubmitReply(parentId: string) {
  // Ensure auth is initialized
  if (!initialized.value) {
    await fetchUser(true)
  }

  if (!user.value?.userId) {
    showAuthModal()
    return
  }
  if (!replyContent.value.trim()) return

  isSubmitting.value = true

  try {
    let result
    if (props.contentType === 'article') {
      result = await addArticleComment(props.contentId, replyContent.value, parentId)
    } else {
      result = await addProjectComment(props.contentId, replyContent.value, parentId)
    }

    // Add reply to the parent comment
    const displayReply = transformComment(result)
    displayReply.userName = user.value.name || user.value.email

    comments.value = comments.value.map((c) =>
      c.id === parentId
        ? { ...c, replies: [...(c.replies || []), displayReply] }
        : c
    )

    replyingTo.value = null
    replyContent.value = ''
  } catch (e: any) {
    console.error('Failed to post reply:', e)
    alert(e.message || 'Failed to post reply')
  } finally {
    isSubmitting.value = false
  }
}

async function handleLikeComment(commentId: string, parentId?: string) {
  // Ensure auth is initialized
  if (!initialized.value) {
    await fetchUser(true)
  }

  if (!user.value?.userId) {
    showAuthModal()
    return
  }

  // Prevent double-clicks
  if (likingCommentId.value === commentId) return

  // Find the comment
  const comment = parentId
    ? comments.value.find(c => c.id === parentId)?.replies?.find(r => r.id === commentId)
    : comments.value.find(c => c.id === commentId)

  if (!comment) return

  likingCommentId.value = commentId

  try {
    let result
    if (comment.isLiked) {
      if (props.contentType === 'article') {
        result = await unlikeArticleComment(commentId)
      } else {
        result = await unlikeProjectComment(commentId)
      }
    } else {
      if (props.contentType === 'article') {
        result = await likeArticleComment(commentId)
      } else {
        result = await likeProjectComment(commentId)
      }
    }

    // Update local state using API response
    const newIsLiked = result.isLiked
    const newLikes = result.likesCount

    if (parentId) {
      comments.value = comments.value.map((c) =>
        c.id === parentId
          ? {
              ...c,
              replies: c.replies?.map((r) => (r.id === commentId ? { ...r, isLiked: newIsLiked, likes: newLikes } : r)),
            }
          : c,
      )
    } else {
      comments.value = comments.value.map((c) => (c.id === commentId ? { ...c, isLiked: newIsLiked, likes: newLikes } : c))
    }
  } catch (e: any) {
    console.error('Failed to like comment:', e)
  } finally {
    likingCommentId.value = null
  }
}
</script>

<template>
  <div :class="$style.container">
    <h2 :class="$style.title">Comments ({{ comments.length }})</h2>

    <div :class="$style.commentBox">
      <div v-if="user?.userId">
        <div :class="$style.formGroup">
          <Textarea v-model="newComment" placeholder="Share your thoughts..." :class="$style.textarea" :disabled="isSubmitting" />
          <Button @click="handleSubmitComment" :disabled="isSubmitting || !newComment.trim()">
            {{ isSubmitting ? 'Posting...' : 'Post Comment' }}
          </Button>
        </div>
      </div>
      <div v-else :class="$style.signInPrompt">
        <p :class="$style.signInText">Sign in to join the conversation</p>
        <Button @click="showAuthModal">Sign In</Button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" :class="$style.errorState">
      <p>{{ error }}</p>
      <Button variant="outline" size="sm" @click="loadComments">Try Again</Button>
    </div>

    <div v-else-if="isLoading" :class="$style.loadingState">
      <div v-for="i in 3" :key="i" :class="$style.skeletonComment">
        <div :class="$style.skeletonAvatar" />
        <div :class="$style.skeletonContent">
          <div :class="$style.skeletonName" />
          <div :class="$style.skeletonText" />
        </div>
      </div>
    </div>

    <div v-else>
      <div v-if="comments && comments.length > 0" :class="$style.commentsList">
        <template v-for="comment in comments" :key="comment.id">
          <div :class="$style.commentWrapper">
            <div :class="$style.comment">
              <div :class="$style.avatar">
                <img v-if="comment.userAvatar" :src="comment.userAvatar" :alt="comment.userName" :class="$style.avatarImage" />
                <div v-else :class="$style.avatarPlaceholder"><Icon name="lucide:user" :class="$style.avatarIcon" /></div>
              </div>
              <div :class="$style.commentBody">
                <div :class="$style.commentHeader">
                  <span :class="$style.userName">{{ comment.userName }}</span>
                  <span :class="$style.timestamp">{{ formatDate(comment.createdAt) }}</span>
                </div>
                <p :class="$style.commentText">{{ comment.content }}</p>
                <div :class="$style.actions">
                  <button @click="handleLikeComment(comment.id)" :disabled="likingCommentId === comment.id" :class="[$style.actionButton, comment.isLiked && $style.liked]">
                    <Icon name="lucide:heart" :class="[$style.actionIcon, comment.isLiked && $style.likedIcon]" /> <span>{{ comment.likes }}</span>
                  </button>
                  <button @click="replyingTo = comment.id" :class="$style.actionButton">
                    <Icon name="lucide:message-circle" :class="$style.actionIcon" /> Reply
                  </button>
                </div>

                <div v-if="replyingTo === comment.id" :class="$style.replyForm">
                  <Textarea v-model="replyContent" placeholder="Write a reply..." :class="$style.replyTextarea" />
                  <div :class="$style.replyActions">
                    <Button size="sm" @click="handleSubmitReply(comment.id)">Reply</Button>
                    <Button size="sm" variant="ghost" @click="replyingTo = null">Cancel</Button>
                  </div>
                </div>

                <div v-if="comment.replies && comment.replies.length > 0" :class="$style.repliesContainer">
                  <template v-for="reply in comment.replies" :key="reply.id">
                    <div :class="$style.commentWrapper">
                      <div :class="$style.comment">
                        <div :class="$style.avatar">
                          <img v-if="reply.userAvatar" :src="reply.userAvatar" :alt="reply.userName" :class="$style.avatarImage" />
                          <div v-else :class="$style.avatarPlaceholder"><Icon name="lucide:user" :class="$style.avatarIcon" /></div>
                        </div>
                        <div :class="$style.commentBody">
                          <div :class="$style.commentHeader">
                            <span :class="$style.userName">{{ reply.userName }}</span>
                            <span :class="$style.timestamp">{{ formatDate(reply.createdAt) }}</span>
                          </div>
                          <p :class="$style.commentText">{{ reply.content }}</p>
                          <div :class="$style.actions">
                            <button @click="handleLikeComment(reply.id, comment.id)" :disabled="likingCommentId === reply.id" :class="[$style.actionButton, reply.isLiked && $style.liked]">
                              <Icon name="lucide:heart" :class="[$style.actionIcon, reply.isLiked && $style.likedIcon]" /> <span>{{ reply.likes }}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-else :class="$style.emptyState">
        <Icon name="lucide:message-circle" :class="$style.emptyIcon" />
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '../assets/styles/variables' as *;

.container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.title {
  font-size: $text-2xl;
  font-weight: 700;
}

.commentBox {
  border-radius: 0.75rem;
  background-color: $color-card;
  border: 1px solid $color-border;
  padding: 1.5rem;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.textarea {
  min-height: 6rem;
}

.signInPrompt {
  text-align: center;
  padding: 2rem 0;
}

.signInText {
  color: $color-muted-foreground;
  margin-bottom: 1rem;
}

.loadingState {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeletonComment {
  display: flex;
  gap: 0.75rem;
}

.skeletonAvatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: var(--muted);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeletonContent {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeletonName {
  height: 1rem;
  width: 25%;
  border-radius: 0.25rem;
  background-color: var(--muted);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeletonText {
  height: 4rem;
  border-radius: 0.25rem;
  background-color: var(--muted);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.commentsList {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.commentWrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.comment {
  display: flex;
  gap: 0.75rem;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: rgba(var(--sunset-orange-rgb, 200, 100, 50), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.avatarImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatarPlaceholder {
  color: var(--sunset-orange);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatarIcon {
  width: 1.25rem;
  height: 1.25rem;
}

.commentBody {
  flex: 1;
  min-width: 0;
}

.commentHeader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.userName {
  font-weight: 500;
  font-size: $text-sm;
}

.timestamp {
  font-size: $text-xs;
  color: $color-muted-foreground;
}

.commentText {
  font-size: $text-sm;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.actionButton {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: $text-xs;
  color: $color-muted-foreground;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: $color-clay-orange;
  }
}

.actionIcon {
  width: 0.875rem;
  height: 0.875rem;
}

.liked {
  color: #ef4444;
}

.likedIcon {
  fill: #ef4444;
  color: #ef4444;
}

.replyForm {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.replyTextarea {
  min-height: 5rem;
  font-size: $text-sm;
}

.replyActions {
  display: flex;
  gap: 0.5rem;
}

.repliesContainer {
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px solid $color-border;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.emptyState {
  text-align: center;
  padding: 3rem 0;
  color: $color-muted-foreground;
}

.emptyIcon {
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 auto 0.75rem;
  opacity: 0.5;
}

.errorState {
  text-align: center;
  padding: 2rem;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.75rem;
  color: #ef4444;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  p {
    margin: 0;
    font-size: $text-sm;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
