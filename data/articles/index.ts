
import { Article } from '../../types';
import { aiSingularity } from './ai-singularity';
import { fragmentedAttention } from './fragmented-attention';
import { aiHistory } from './ai-history';

export const articles: Article[] = [
  aiHistory,
  aiSingularity,
  fragmentedAttention
];
