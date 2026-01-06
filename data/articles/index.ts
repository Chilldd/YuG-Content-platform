
import { Article } from '../../types';
import { aiSingularity } from './ai-singularity';
import { fragmentedAttention } from './fragmented-attention';
import { aiHistory } from './ai-history';
import { aiDeveloperEfficiency } from './ai-developer-efficiency';

export const articles: Article[] = [
  aiDeveloperEfficiency, // 最新文章置顶
  aiHistory,
  aiSingularity,
  fragmentedAttention
];
