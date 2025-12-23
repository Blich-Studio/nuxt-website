import type { Project, ProjectListItem, ProjectFilters, ApiMeta, Comment, LikeStatus } from '~/types/api'

export function useProjects() {
  const api = useApi()

  /**
   * Fetch a paginated list of published projects
   */
  async function getProjects(
    filters?: ProjectFilters,
    pagination?: { page?: number; limit?: number; sort?: string; order?: 'asc' | 'desc' }
  ): Promise<{ projects: ProjectListItem[]; meta: ApiMeta }> {
    const query: Record<string, any> = {
      status: 'published', // Public site only shows published projects
      ...filters,
      ...pagination,
    }

    const response = await api<{ data: ProjectListItem[]; meta: ApiMeta }>('/projects', { query })
    
    return {
      projects: response.data || [],
      meta: response.meta || {},
    }
  }

  /**
   * Fetch a single project by ID or slug
   */
  async function getProject(idOrSlug: string): Promise<Project | null> {
    try {
      // Try by slug first, then by ID
      const endpoint = idOrSlug.match(/^[0-9a-f-]{36}$/i)
        ? `/projects/${idOrSlug}`
        : `/projects/slug/${idOrSlug}`
      const response = await api<{ data: Project }>(endpoint)
      return response.data || null
    } catch (error: any) {
      if (error?.statusCode === 404 || error?.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * Like a project
   */
  async function likeProject(projectId: string): Promise<LikeStatus> {
    const response = await api<{ data: LikeStatus }>(`/projects/${projectId}/like`, { method: 'POST' })
    return response.data
  }

  /**
   * Unlike a project
   */
  async function unlikeProject(projectId: string): Promise<LikeStatus> {
    const response = await api<{ data: LikeStatus }>(`/projects/${projectId}/like`, { method: 'DELETE' })
    return response.data
  }

  /**
   * Get comments for a project
   */
  async function getComments(
    projectId: string,
    pagination?: { page?: number; limit?: number }
  ): Promise<{ comments: Comment[]; meta: ApiMeta }> {
    const response = await api<{ data: Comment[]; meta: ApiMeta }>('/comments', {
      query: {
        projectId,
        status: 'approved',
        ...pagination,
      },
    })

    return {
      comments: response.data || [],
      meta: response.meta || {},
    }
  }

  /**
   * Add a comment to a project
   */
  async function addComment(projectId: string, content: string): Promise<Comment> {
    const response = await api<{ data: Comment }>('/comments', {
      method: 'POST',
      body: {
        projectId,
        content,
      },
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

  return {
    getProjects,
    getProject,
    likeProject,
    unlikeProject,
    getComments,
    addComment,
    likeComment,
    unlikeComment,
  }
}
