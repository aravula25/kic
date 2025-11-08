export type Post = {
    _id: string;
    imageUrl: string[];
    description: string;
    location: { name: string };
    status: 'resolved' | 'unresolved'; // strict literal type
    createdBy: { name: string };
    createdAt: string;
  };
  