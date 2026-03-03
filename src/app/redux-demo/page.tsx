'use client';

/**
 * Redux Demo Page
 *
 * Demonstrates the Redux integration with:
 * - List with pagination
 * - CRUD operations
 * - Toast notifications
 * - Loading states
 */

import { useEffect } from 'react';
import {
  MuiButton,
  MuiCard,
  MuiCardContent,
  MuiCardActions,
  MuiTypography,
  MuiStack,
  MuiBox,
  MuiChip,
  MuiAlert,
  MuiTextField,
} from '@/components/ui/mui';
import { usePosts } from '@/features/posts/hooks/use-posts';
import { useAppDispatch } from '@/store/hooks';
import { addToast, createSuccessToast, createErrorToast } from '@/features/shared/redux/ui.slice';
import { CreatePostInput } from '@/features/posts/types';

export default function ReduxDemoPage() {
  const dispatch = useAppDispatch();
  const {
    posts,
    total,
    pagination,
    isLoading,
    isUpdating,
    isDeleting,
    isBusy,
    error,
    changePage,
    nextPage,
    prevPage,
    refresh,
    create,
    update,
    remove,
    search,
    clearError,
  } = usePosts(true);

  // Example: Create post handler
  const handleCreatePost = async () => {
    try {
      const newPost: CreatePostInput = {
        title: 'New Post Created with Redux',
        excerpt: 'This post was created using Redux Toolkit',
        content: 'Full content here...',
        author: 'Redux User',
      };

      await create(newPost);
      dispatch(createSuccessToast('Post created successfully!'));
    } catch (err) {
      dispatch(createErrorToast('Failed to create post'));
    }
  };

  // Example: Update post handler
  const handleUpdatePost = async (id: string) => {
    try {
      await update(id, { title: 'Updated Post Title' });
      dispatch(createSuccessToast('Post updated successfully!'));
    } catch (err) {
      dispatch(createErrorToast('Failed to update post'));
    }
  };

  // Example: Delete post handler
  const handleDeletePost = async (id: string) => {
    try {
      await remove(id);
      dispatch(createSuccessToast('Post deleted successfully!'));
    } catch (err) {
      dispatch(createErrorToast('Failed to delete post'));
    }
  };

  // Example: Search handler
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('search') as string;
    search(searchQuery);
  };

  return (
    <div className="container max-w-6xl mx-auto p-8">
      <MuiTypography variant="h3" className="mb-6">
        Redux + API Integration Demo
      </MuiTypography>

      {/* Info Alert */}
      <MuiAlert severity="info" className="mb-6">
        This page demonstrates Redux Toolkit integration with CRUD operations,
        pagination, and toast notifications.
      </MuiAlert>

      {/* Error Display */}
      {error && (
        <MuiAlert severity="error" className="mb-6" onClose={clearError}>
          {error}
        </MuiAlert>
      )}

      {/* Actions Bar */}
      <MuiCard className="mb-6">
        <MuiCardContent>
          <MuiStack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            {/* Create Button */}
            <MuiButton
              variant="contained"
              color="primary"
              onClick={handleCreatePost}
              disabled={isUpdating || isBusy}
            >
              {isUpdating ? 'Creating...' : 'Create Post'}
            </MuiButton>

            {/* Refresh Button */}
            <MuiButton
              variant="outlined"
              onClick={refresh}
              disabled={isLoading}
            >
              Refresh
            </MuiButton>

            {/* Total Count */}
            <MuiChip
              label={`Total: ${total}`}
              color="info"
              variant="outlined"
            />

            {/* Page Info */}
            <MuiChip
              label={`Page ${pagination.page} of ${Math.ceil(total / pagination.pageSize) || 1}`}
              variant="outlined"
            />

            {/* Loading Indicator */}
            {isBusy && (
              <MuiChip label="Loading..." color="primary" variant="filled" />
            )}
          </MuiStack>
        </MuiCardContent>
      </MuiCard>

      {/* Search Bar */}
      <MuiCard className="mb-6">
        <MuiCardContent>
          <form onSubmit={handleSearch}>
            <MuiStack direction="row" spacing={2} alignItems="center">
              <MuiTextField
                name="search"
                placeholder="Search posts..."
                size="small"
                fullWidth
              />
              <MuiButton type="submit" variant="outlined" disabled={isBusy}>
                Search
              </MuiButton>
              <MuiButton
                type="button"
                variant="text"
                onClick={() => search('')}
                disabled={isBusy}
              >
                Clear
              </MuiButton>
            </MuiStack>
          </form>
        </MuiCardContent>
      </MuiCard>

      {/* Posts List */}
      {isLoading && posts.length === 0 ? (
        <MuiCard>
          <MuiCardContent>
            <MuiTypography variant="body1" className="text-center py-8">
              Loading posts...
            </MuiTypography>
          </MuiCardContent>
        </MuiCard>
      ) : posts.length === 0 ? (
        <MuiCard>
          <MuiCardContent>
            <MuiTypography variant="body1" className="text-center py-8">
              No posts found. Create one to get started!
            </MuiTypography>
          </MuiCardContent>
        </MuiCard>
      ) : (
        <MuiStack spacing={3}>
          {posts.map((post) => (
            <MuiCard key={post.id}>
              <MuiCardContent>
                <MuiStack spacing={2}>
                  <MuiTypography variant="h6">{post.title}</MuiTypography>
                  <MuiTypography variant="body2" color="textSecondary">
                    {post.excerpt}
                  </MuiTypography>
                  <MuiStack direction="row" spacing={2} alignItems="center">
                    <MuiChip label={post.author} size="small" variant="outlined" />
                    <MuiChip
                      label={new Date(post.createdAt).toLocaleDateString()}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  </MuiStack>
                </MuiStack>
              </MuiCardContent>
              <MuiCardActions>
                <MuiButton
                  size="small"
                  onClick={() => handleUpdatePost(post.id)}
                  disabled={isUpdating}
                >
                  Update
                </MuiButton>
                <MuiButton
                  size="small"
                  color="error"
                  onClick={() => handleDeletePost(post.id)}
                  disabled={isDeleting}
                >
                  Delete
                </MuiButton>
              </MuiCardActions>
            </MuiCard>
          ))}
        </MuiStack>
      )}

      {/* Pagination Controls */}
      {posts.length > 0 && (
        <MuiCard className="mt-6">
          <MuiCardContent>
            <MuiStack direction="row" spacing={2} justifyContent="center" alignItems="center">
              <MuiButton
                variant="outlined"
                onClick={prevPage}
                disabled={pagination.page <= 1 || isBusy}
              >
                Previous
              </MuiButton>
              <MuiTypography variant="body2">
                Page {pagination.page} of {Math.ceil(total / pagination.pageSize) || 1}
              </MuiTypography>
              <MuiButton
                variant="outlined"
                onClick={nextPage}
                disabled={pagination.page >= Math.ceil(total / pagination.pageSize) || isBusy}
              >
                Next
              </MuiButton>
            </MuiStack>
          </MuiCardContent>
        </MuiCard>
      )}

      {/* Code Example */}
      <MuiCard className="mt-8">
        <MuiCardContent>
          <MuiTypography variant="h6" className="mb-4">
            Usage Example
          </MuiTypography>
          <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
            {`// Import the hook
import { usePosts } from '@/features/posts/hooks/use-posts';
import { useAppDispatch } from '@/store/hooks';
import { createSuccessToast } from '@/features/shared/redux/ui.slice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const {
    posts,
    isLoading,
    create,
    update,
    remove,
    changePage,
  } = usePosts();

  const handleCreate = async () => {
    await create({ title: 'New Post', content: '...' });
    dispatch(createSuccessToast('Created!'));
  };

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      <button onClick={handleCreate}>Create</button>
      <button onClick={() => changePage(2)}>Page 2</button>
    </div>
  );
}`}
          </pre>
        </MuiCardContent>
      </MuiCard>
    </div>
  );
}
