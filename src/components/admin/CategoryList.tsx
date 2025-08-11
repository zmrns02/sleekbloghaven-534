import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  icon?: string;
  parent_id?: number | null;
}

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const toggleExpand = (categoryId: number) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const renderCategory = (category: Category) => {
    const hasChildren = categories.some(c => c.parent_id === category.id);
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id} className="space-y-1">
        <div 
          className="flex items-center justify-between p-3 hover:bg-accent rounded-md cursor-pointer"
          onClick={() => toggleExpand(category.id)}
        >
          <div className="flex items-center gap-2">
            {hasChildren && (
              <span className="w-4 h-4">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            )}
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-full">✏️</button>
            <button className="p-2 hover:bg-muted rounded-full">🗑️</button>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="ml-6 space-y-1">
            {categories
              .filter(c => c.parent_id === category.id)
              .map(subcategory => renderCategory(subcategory))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {categories
        .filter(category => !category.parent_id)
        .map(category => renderCategory(category))}
    </div>
  );
}