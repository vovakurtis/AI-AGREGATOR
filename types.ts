export interface NewsItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  timestamp: string;
  imageUrl: string;
  source: string;
}

export interface SearchResult {
  text: string;
  sources: {
    uri: string;
    title: string;
  }[];
}

export interface User {
  email: string;
  name: string;
}

export enum ViewState {
  HOME = 'HOME',
  TRENDING = 'TRENDING',
  RESEARCH = 'RESEARCH',
  SETTINGS = 'SETTINGS'
}
