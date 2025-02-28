import { createAction, props } from '@ngrx/store';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';

export const create = createAction(
  '[Post] Create',
  props<{ post: any; idToken: string }>()
);

export const createSuccess = createAction('[Post] Create Success');

export const createFailure = createAction(
  '[Post] Create Failure',
  props<{ errorMessage: any }>()
);

export const get = createAction(
  '[Post] Get ',
  props<{ idToken: string; page: number; pageSize: number }>()
);
export const getSuccess = createAction(
  '[Post] Get Success',
  props<{ posts: Post[] }>()
);
export const getFailure = createAction(
  '[Post] Get Failure',
  props<{ errorMessage: any }>()
);

export const getById = createAction(
  '[Post] Get By Id ',
  props<{ idToken: string; id: string | null }>()
);
export const getByIdSuccess = createAction(
  '[Post] Get By Id Success',
  props<{ post: Post }>()
);
export const getByIdFailure = createAction(
  '[Post] Get By Id Failure',
  props<{ errorMessage: any }>()
);

export const clearAllState = createAction('[Post] Clear All State');
