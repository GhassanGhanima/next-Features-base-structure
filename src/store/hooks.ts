import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './index';

/**
 * Typed useAppDispatch hook
 *
 * Usage:
 * const dispatch = useAppDispatch();
 * dispatch(fetchPosts());
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed useAppSelector hook
 *
 * Usage:
 * const posts = useAppSelector((state) => state.posts.list.data);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
