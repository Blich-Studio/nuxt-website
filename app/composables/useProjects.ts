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
   * Fetch featured published projects for homepage
   */
  async function getFeaturedProjects(limit: number = 4): Promise<ProjectListItem[]> {
    const response = await api<{ data: ProjectListItem[]; meta: ApiMeta }>('/projects', {
      query: {
        status: 'published',
        featured: true,
        limit,
      },
    })
    return response.data || []
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
      const response = await api<Project>(endpoint)
      return response || null
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
    return await api<LikeStatus>(`/projects/${projectId}/like`, { method: 'POST' })
  }

  /**
   * Unlike a project
   */
  async function unlikeProject(projectId: string): Promise<LikeStatus> {
    return await api<LikeStatus>(`/projects/${projectId}/like`, { method: 'DELETE' })
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
  async function addComment(projectId: string, content: string, parentId?: string): Promise<Comment> {
    return await api<Comment>('/comments', {
      method: 'POST',
      body: {
        projectId,
        content,
        parentId,
      },
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

  return {
    getProjects,
    getFeaturedProjects,
    getProject,
    likeProject,
    unlikeProject,
    getComments,
    addComment,
    likeComment,
    unlikeComment,
  }
}
