import { TransformFnParams } from 'class-transformer/types/interfaces';
import { MaybeType } from '../interface/maybe.interface';

export const lowerCaseTransformer = (
  params: TransformFnParams,
): MaybeType<string> => params.value?.toLowerCase().trim();
