import type { Article, ArticleListItem, ArticleFilters, ArticlePagination, ApiResponse, ApiMeta, Comment, CreateCommentInput, Tag, LikeStatus } from '~/types/api'

export function useArticles() {
  const api = useApi()

  /**
   * Fetch a paginated list of published articles
   */
  async function getArticles(
    filters?: ArticleFilters,
    pagination?: ArticlePagination
  ): Promise<{ articles: ArticleListItem[]; meta: ApiMeta }> {
    const query: Record<string, any> = {
      status: 'published', // Public site only shows published articles
      ...filters,
      ...pagination,
    }

    const response = await api<{ data: ArticleListItem[]; meta: ApiMeta }>('/articles', { query })
    
    return {
      articles: response.data || [],
      meta: response.meta || {},
    }
  }

  /**
   * Fetch a single article by ID or slug
   */
  async function getArticle(idOrSlug: string): Promise<Article | null> {
    try {
      // Try by slug first, then by ID
      const endpoint = idOrSlug.match(/^[0-9a-f-]{36}$/i)
        ? `/articles/${idOrSlug}`
        : `/articles/slug/${idOrSlug}`
      const response = await api<{ data: Article }>(endpoint)
      return response.data || null
    } catch (error: any) {
      if (error?.statusCode === 404 || error?.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * Get all tags
   */
  async function getTags(): Promise<Tag[]> {
    try {
      const response = await api<{ data: Tag[] }>('/tags')
      return response.data || []
    } catch {
      return []
    }
  }

  /**
   * Like an article
   */
  async function likeArticle(articleId: string): Promise<LikeStatus> {
    const response = await api<{ data: LikeStatus }>(`/articles/${articleId}/like`, { method: 'POST' })
    return response.data
  }

  /**
   * Unlike an article
   */
  async function unlikeArticle(articleId: string): Promise<LikeStatus> {
    const response = await api<{ data: LikeStatus }>(`/articles/${articleId}/like`, { method: 'DELETE' })
    return response.data
  }

  /**
   * Get comments for an article
   */
  async function getComments(
    articleId: string,
    pagination?: { page?: number; limit?: number }
  ): Promise<{ comments: Comment[]; meta: ApiMeta }> {
    const response = await api<{ data: Comment[]; meta: ApiMeta }>('/comments', {
      query: {
        articleId,
        status: 'approved', // Only show approved comments on public site
        ...pagination,
      },
    })

    return {
      comments: response.data || [],
      meta: response.meta || {},
    }
  }

  /**
   * Add a comment to an article
   */
  async function addComment(articleId: string, content: string): Promise<Comment> {
    const response = await api<{ data: Comment }>('/comments', {
      method: 'POST',
      body: { articleId, content },
    })
    return response.data
  }

  /**
   * Like a comment
   */
  async function likeComment(commentId: string): Promise<LikeStatus> {
    const response = await api<{ data: LikeStatus }>(`/comments/${commentId}/like`, { method: 'POST' })
    return response.data
  }

  /**
   * Unlike a comment
   */
  async function unlikeComment(commentId: string): Promise<LikeStatus> {
    const response = await api<{ data: LikeStatus }>(`/comments/${commentId}/like`, { method: 'DELETE' })
    return response.data
  }

  /**
   * Calculate estimated read time for an article
   */
  function calculateReadTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.trim().split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  return {
    getArticles,
    getArticle,
    getTags,
    likeArticle,
    unlikeArticle,
    getComments,
    addComment,
    likeComment,
    unlikeComment,
    calculateReadTime,
  }
}
