import type { Article, ArticleListItem, ArticleFilters, ArticlePagination, ApiMeta, Comment, Tag, LikeStatus } from '~/types/api'

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
      const response = await api<Article>(endpoint)
      return response || null
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
      const response = await api<Tag[]>('/tags')
      return response || []
    } catch {
      return []
    }
  }

  /**
   * Like an article
   */
  async function likeArticle(articleId: string): Promise<LikeStatus> {
    return await api<LikeStatus>(`/articles/${articleId}/like`, { method: 'POST' })
  }

  /**
   * Unlike an article
   */
  async function unlikeArticle(articleId: string): Promise<LikeStatus> {
    return await api<LikeStatus>(`/articles/${articleId}/like`, { method: 'DELETE' })
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
  async function addComment(articleId: string, content: string, parentId?: string): Promise<Comment> {
    return await api<Comment>('/comments', {
      method: 'POST',
      body: { articleId, content, parentId },
    })
  }

  /**
   * Like a comment
   */
  async function likeComment(commentId: string): Promise<LikeStatus> {
    return await api<LikeStatus>(`/comments/${commentId}/like`, { method: 'POST' })
  }

  /**
   * Unlike a comment
   */
  async function unlikeComment(commentId: string): Promise<LikeStatus> {
    return await api<LikeStatus>(`/comments/${commentId}/like`, { method: 'DELETE' })
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
