import { useState } from 'react';
import { useMenu } from '@/hooks/useMenu';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function CategoryManager() {
  const { categories, createCategory, updateCategory, deleteCategory } = useMenu();
  const { t } = useLanguage();
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    display_order: 0,
    parent_id: null as number | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      await updateCategory(editingCategory.id, formData);
    } else {
      await createCategory(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', icon: '', display_order: 0, parent_id: null });
    setEditingCategory(null);
    setDialogOpen(false);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      display_order: category.display_order,
      parent_id: category.parent_id || null,
    });
    setDialogOpen(true);
  };

  // Get main categories (no parent)
  const mainCategories = categories.filter(cat => !cat.parent_id);
  
  // Get subcategories for a given parent
  const getSubcategories = (parentId: number) => 
    categories.filter(cat => cat.parent_id === parentId);

  // Determine depth of a category for indentation in selects
  const getDepth = (categoryId: number) => {
    let depth = 0;
    let current = categories.find(c => c.id === categoryId);
    while (current?.parent_id) {
      depth++;
      current = categories.find(c => c.id === current!.parent_id!);
    }
    return depth;
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };
  // Render category row with proper indentation
  const renderCategoryRow = (category: any, level: number = 0) => {
    const subcategories = getSubcategories(category.id);
    const isExpanded = expandedCategories.has(category.id);
    const hasSubcategories = subcategories.length > 0 || category.has_subcategories;
    
    return (
      <>
        <TableRow key={category.id} className="group">
          <TableCell>
            <Badge variant="outline">{category.display_order}</Badge>
          </TableCell>
          <TableCell>
            <span className="text-lg">{category.icon}</span>
          </TableCell>
          <TableCell className="font-medium">
            <div 
              className="flex items-center cursor-pointer hover:text-primary"
              onClick={() => toggleCategoryExpansion(category.id)}
            >
              {/* Indentation for nested categories */}
              {level > 0 && (
                <div style={{ marginLeft: `${level * 20}px` }} className="flex items-center mr-2">
                  <div className="w-4 h-px bg-border mr-1" />
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
              {/* Show expand/collapse button for any category */}
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto mr-2 opacity-100 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategoryExpansion(category.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
              <span>{category.name}</span>
            </div>
          </TableCell>
          <TableCell className="max-w-xs truncate">
            {category.description}
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(category)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(category.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {/* Always try to render subcategories if expanded */}
        {isExpanded && subcategories.map(subcat => renderCategoryRow(subcat, level + 1))}
      </>
    );
  };

  const handleDelete = async (id: number) => {
    if (confirm(t('admin.confirmDeleteCategory'))) {
      await deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.categoryManagement')}</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.newCategory')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? t('admin.editCategory') : t('admin.newCategory')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">{t('admin.categoryName')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">{t('admin.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="icon">{t('admin.icon')}</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder={t('admin.iconPlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="parent_id">{t('admin.parentCategory')}</Label>
                <Select 
                  value={formData.parent_id?.toString() || "none"} 
                  onValueChange={(value) => setFormData({ ...formData, parent_id: value === "none" ? null : parseInt(value) })}
                >
                  <SelectTrigger className="bg-background/90 backdrop-blur-sm">
                    <SelectValue placeholder={t('admin.selectParentCategory')} />
                  </SelectTrigger>
                  <SelectContent className="z-[60] bg-background/95 backdrop-blur-sm border-2 text-popover-foreground">
                    <SelectItem value="none" className="whitespace-nowrap">{t('admin.noParentCategory')}</SelectItem>
                    {categories.map((category) => {
                      const depth = getDepth(category.id);
                      const prefix = depth === 0 ? '' : depth === 1 ? '— ' : '—— ';
                      return (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                          disabled={editingCategory?.id === category.id}
                          className="whitespace-nowrap"
                        >
                          {prefix}{category.icon} {category.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="display_order">{t('admin.sorting')}</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingCategory ? t('admin.update') : t('admin.add')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  {t('admin.cancel')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.categories')} ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.order')}</TableHead>
                <TableHead>{t('admin.icon')}</TableHead>
                <TableHead>{t('admin.categoryName')}</TableHead>
                <TableHead>{t('admin.description')}</TableHead>
                <TableHead>{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mainCategories.map((category) => renderCategoryRow(category))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}