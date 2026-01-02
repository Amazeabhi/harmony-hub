import { cn } from '@/lib/utils';

interface CardGridProps {
  children: React.ReactNode;
  className?: string;
}

const CardGrid = ({ children, className }: CardGridProps) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4',
        className
      )}
    >
      {children}
    </div>
  );
};

export default CardGrid;
