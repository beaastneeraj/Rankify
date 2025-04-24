import { TrendingUp, Cpu, GraduationCap, School } from 'lucide-react'; // Import Lucide icons

export const rankingYears = ['2024', '2023', '2022', '2021'];

export const categories = ['overall', 'engineering', 'university', 'college'];
export const categoryIcons = {
  overall: <TrendingUp className="h-12 w-12 text-blue-500 mb-4" />,
  engineering: <Cpu className="h-12 w-12 text-green-500 mb-4" />,
  university: <GraduationCap className="h-12 w-12 text-purple-500 mb-4" />,
  college: <School className="h-12 w-12 text-yellow-500 mb-4" />,
};

export const categoryText = {
  overall: 'Discover the overall rankings based on all factors combined.',
  engineering: 'Check out the top engineering institutions and their specialties.',
  university: 'Explore the rankings for top universities.',
  college: 'Explore the rankings for top colleges.',
};