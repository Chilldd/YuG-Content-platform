
export interface Article {
  id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  coverImage: string;
  readingTime: string;
  content: string; // Markdown or plain text with HTML tags
}

export type ViewState = 'list' | 'detail' | 'archive' | 'about' | 'contact';
