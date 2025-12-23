// API response wrapper types
export interface ApiResponse<T> {
  data: T
  meta?: ApiMeta
}

export interface ApiMeta {
  total?: number
  page?: number
  limit?: number
  totalPages?: number
  hasNext?: boolean
  hasPrev?: boolean
}

export interface ApiError {
  error: {
    message: string
    code?: string
    statusCode: number
  }
}

// User/Author types (as embedded in responses)
export interface Author {
  id: string
  displayName: string
  avatarUrl: string | null
}

export interface User {
  id: string
  email: string
  displayName: string
  role: 'admin' | 'author' | 'user'
  status: 'active' | 'invited' | 'disabled'
  avatarUrl?: string | null
  bio?: string | null
  createdAt: string
  updatedAt: string
}

// Tag types
export interface Tag {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string
  updatedAt: string
}

// Article types
export interface Article {
  id: string
  title: string
  slug: string
  perex: string
  content: string
  coverImageUrl: string | null
  author: Author
  status: 'draft' | 'published' | 'archived'
  tags: Tag[]
  likesCount: number
  viewsCount: number
  isLiked?: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  // Computed fields for display
  readTime?: number
}

// Article list item (content omitted)
export interface ArticleListItem extends Omit<Article, 'content'> {}

export interface ArticleFilters {
  status?: 'draft' | 'published' | 'archived'
  authorId?: string
  tags?: string
  search?: string
}

export interface ArticlePagination {
  page?: number
  limit?: number
  sort?: 'createdAt' | 'publishedAt' | 'likesCount' | 'viewsCount' | 'title'
  order?: 'asc' | 'desc'
}

// Comment types
export interface CommentUser {
  id: string
  displayName: string
  avatarUrl: string | null
}

export interface Comment {
  id: string
  content: string
  user: CommentUser
  userId: string
  articleId: string | null
  projectId: string | null
  parentId: string | null
  status: 'pending' | 'approved' | 'rejected' | 'spam'
  likesCount: number
  isLiked?: boolean
  replies?: Comment[]
  createdAt: string
  updatedAt: string
}

export interface CreateCommentInput {
  content: string
  articleId?: string
  projectId?: string
  parentId?: string
}

// Like types
export interface LikeStatus {
  isLiked: boolean
  likesCount: number
}

// Project types
export interface Project {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string | null
  coverImageUrl: string | null
  galleryUrls: string[]
  videoUrl: string | null
  externalUrl: string | null
  githubUrl: string | null
  author: Author
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  tags: Tag[]
  likesCount: number
  viewsCount: number
  isLiked?: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

// Project list item (description omitted)
export interface ProjectListItem extends Omit<Project, 'description'> {}

export interface ProjectFilters {
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean
  tags?: string
  search?: string
}
