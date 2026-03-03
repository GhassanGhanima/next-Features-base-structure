// Components
export * from './components';

// Hooks
export * from './hooks';

// Redux - selective export to avoid naming conflicts
export { postsReducer } from './redux';
export {
  fetchPosts,
  fetchPostById,
  createPost as createPostThunk,
  updatePost as updatePostThunk,
  deletePost as deletePostThunk,
  deleteManyPosts,
  setPage,
  setPageSize,
  setSearch,
  setSorting,
  setSelectedPostId,
  clearSelectedPostId,
  clearListError,
  clearAllErrors,
  resetPostsState,
  selectPostsList,
  selectPostsById,
  selectPostsPagination,
  selectSelectedPostId,
  selectIsDeleting,
  selectIsUpdating,
  selectPostsItems,
  selectPostsTotal,
  selectPostsIsLoading,
  selectPostsError,
} from './redux/posts.slice';

// Services
export { getPosts, getPostById, createPost, updatePost, deletePost } from './services/posts';

// Types
export * from './types';
