import { 
  Music, Film, Mic, Palette, Gamepad2, Trophy, Clapperboard, Handbag 
} from 'lucide-react';

export const categories = [
  { id: 'all', label: 'All Events', icon: Clapperboard, color: 'from-amber-500 to-red-500' },
  { id: 'music', label: 'Music', icon: Music, color: 'from-blue-500 to-purple-500' },
  { id: 'dance', label: 'Dance', icon: Film, color: 'from-pink-500 to-rose-500' },
  { id: 'arts', label: 'Arts', icon: Palette, color: 'from-green-500 to-emerald-500' },
  { id: 'theatre', label: 'Theatre', icon: Mic, color: 'from-orange-500 to-amber-500' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'from-purple-500 to-indigo-500' },
  { id: 'fashion', label: 'Fashion', icon: Handbag, color: 'from-red-500 to-orange-500' },
];

export const getCategoryIcon = (categoryId) => {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.icon : Clapperboard;
};

export const getCategoryColor = (categoryId) => {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.color : 'from-amber-500 to-red-500';
};