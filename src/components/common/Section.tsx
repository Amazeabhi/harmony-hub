import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface SectionProps {
  title: string;
  showAll?: string;
  children: React.ReactNode;
}

const Section = ({ title, showAll, children }: SectionProps) => {
  return (
    <section className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {showAll && (
          <Link
            to={showAll}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            Show all
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
};

export default Section;
