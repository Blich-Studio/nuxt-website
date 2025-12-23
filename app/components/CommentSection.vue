<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Button from './ui/Button.vue'
import Textarea from './ui/Textarea.vue'

interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
  likes: number
  isLiked: boolean
  replies?: Comment[]
}

const props = defineProps<{ contentType: 'project' | 'article'; contentId: string }>()

// Simple mock-auth for demo purposes (replace with real auth composable later)
const user = ref<{ id: string; name: string; avatar?: string } | null>(null)
function showAuthModal() {
  // replace with real modal flow
  alert('Open sign-in modal (demo)')
}

const comments = ref<Comment[]>([])
const newComment = ref('')
const replyingTo = ref<string | null>(null)
const replyContent = ref('')
const isLoading = ref(true)

onMounted(() => {
  loadComments()
})

async function loadComments() {
  isLoading.value = true
  await new Promise((r) => setTimeout(r, 400))
  comments.value = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Alex Rivera',
      userAvatar: '/user-avatar-1.jpg',
      content: 'This is absolutely amazing! The attention to detail is incredible.',
      createdAt: '2024-12-18T10:30:00Z',
      likes: 24,
      isLiked: false,
      replies: [
        {
          id: '1-1',
          userId: 'user2',
          userName: 'Jordan Lee',
          content: 'I totally agree! The desert aesthetic is so well executed.',
          createdAt: '2024-12-18T11:00:00Z',
          likes: 8,
          isLiked: false,
        },
      ],
    },
    {
      id: '2',
      userId: 'user3',
      userName: 'Sam Chen',
      userAvatar: '/user-avatar-2.jpg',
      content: "Can't wait to see what you create next. Keep up the fantastic work!",
      createdAt: '2024-12-17T15:20:00Z',
      likes: 15,
      isLiked: false,
    },
  ]
  isLoading.value = false
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

function handleSubmitComment() {
  if (!user.value) {
    showAuthModal()
    return
  }
  if (!newComment.value.trim()) return
  const comment: Comment = {
    id: Date.now().toString(),
    userId: user.value.id,
    userName: user.value.name,
    userAvatar: user.value.avatar,
    content: newComment.value,
    createdAt: new Date().toISOString(),
    likes: 0,
    isLiked: false,
    replies: [],
  }
  comments.value = [comment, ...comments.value]
  newComment.value = ''
}

function handleSubmitReply(parentId: string) {
  if (!user.value) {
    showAuthModal()
    return
  }
  if (!replyContent.value.trim()) return
  const reply: Comment = {
    id: Date.now().toString(),
    userId: user.value.id,
    userName: user.value.name,
    userAvatar: user.value.avatar,
    content: replyContent.value,
    createdAt: new Date().toISOString(),
    likes: 0,
    isLiked: false,
  }
  comments.value = comments.value.map((c) => (c.id === parentId ? { ...c, replies: [...(c.replies || []), reply] } : c))
  replyContent.value = ''
  replyingTo.value = null
}

function handleLikeComment(commentId: string, parentId?: string) {
  if (!user.value) {
    showAuthModal()
    return
  }
  if (parentId) {
    comments.value = comments.value.map((c) =>
      c.id === parentId
        ? {
            ...c,
            replies: c.replies?.map((r) => (r.id === commentId ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 } : r)),
          }
        : c,
    )
  } else {
    comments.value = comments.value.map((c) => (c.id === commentId ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 } : c))
  }
}
</script>

<template>
  <div :class="$style.container">
    <h2 :class="$style.title">Comments ({{ comments.length }})</h2>

    <div :class="$style.commentBox">
      <div v-if="user">
        <div :class="$style.formGroup">
          <Textarea v-model="newComment" placeholder="Share your thoughts..." :class="$style.textarea" />
          <Button @click="handleSubmitComment">Post Comment</Button>
        </div>
      </div>
      <div v-else :class="$style.signInPrompt">
        <p :class="$style.signInText">Sign in to join the conversation</p>
        <Button @click="showAuthModal">Sign In</Button>
      </div>
    </div>

    <div v-if="isLoading" :class="$style.loadingState">
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
                  <button @click="handleLikeComment(comment.id)" :class="$style.actionButton">
                    <Icon name="lucide:heart" :class="$style.actionIcon" /> <span>{{ comment.likes }}</span>
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
                            <button @click="handleLikeComment(reply.id, comment.id)" :class="$style.actionButton">
                              <Icon name="lucide:heart" :class="$style.actionIcon" /> <span>{{ reply.likes }}</span>
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

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
