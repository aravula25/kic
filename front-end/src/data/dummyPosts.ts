import { Post } from '@/types/post';

const locations = ['City Park', 'Main Street', 'River Side', 'Downtown', 'Suburb', 'Community Center', 'School Grounds', 'Industrial Area', 'Market Square', 'Beach'];
const descriptions = [
  'Trash cleaned in park',
  'Overflowing bins reported',
  'Graffiti removed',
  'Street lights fixed',
  'Pothole repaired',
  'Fallen tree removed',
  'Road sign damaged',
  'Recycling bins placed',
  'Water leak fixed',
  'Community cleanup organized'
];
const statuses: Array<'resolved' | 'unresolved'> = ['resolved', 'unresolved']; // only these two
const creators = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Davis', 'Emily White', 'Frank Miller', 'Grace Lee', 'Hannah Wilson', 'Ian Clark'];

export const dummyPosts: Post[] = Array.from({ length: 100 }, (_, i) => {
  const randomImageNum = i + 1;
  const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomCreator = creators[Math.floor(Math.random() * creators.length)];
  const randomDaysAgo = Math.floor(Math.random() * 30); // last 30 days
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - randomDaysAgo);

  return {
    _id: (i + 1).toString(),
    imageUrl: [`https://picsum.photos/400/300?${randomImageNum}`],
    description: randomDescription,
    location: { name: randomLocation },
    status: randomStatus,
    createdBy: { name: randomCreator },
    createdAt: createdAt.toISOString(),
  };
});
