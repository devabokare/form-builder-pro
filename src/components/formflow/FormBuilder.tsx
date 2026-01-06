import { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { FormField, FieldType, FIELD_TYPES } from '@/types/form';
import { FieldPalette } from './FieldPalette';
import { FormCanvas } from './FormCanvas';
import { FieldEditor } from './FieldEditor';
import { FormPreview } from './FormPreview';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  EyeOff, 
  Save, 
  Share2, 
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import clipboardIcon from '@/assets/clipboard-icon.png';

export function FormBuilder() {
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  const createField = useCallback((type: FieldType): FormField => {
    const fieldInfo = FIELD_TYPES.find((f) => f.type === type)!;
    const hasOptions = ['dropdown', 'radio', 'checkbox'].includes(type);

    return {
      id: uuidv4(),
      type,
      label: '',
      placeholder: '',
      required: false,
      options: hasOptions
        ? [
            { id: uuidv4(), label: 'Option 1', value: 'option1' },
            { id: uuidv4(), label: 'Option 2', value: 'option2' },
          ]
        : undefined,
    };
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeData = active.data.current;

    // Adding new field from palette
    if (activeData?.isNew) {
      const type = activeData.type as FieldType;
      const newField = createField(type);
      
      if (over.id === 'form-canvas') {
        setFields((prev) => [...prev, newField]);
      } else {
        const overIndex = fields.findIndex((f) => f.id === over.id);
        if (overIndex !== -1) {
          setFields((prev) => {
            const newFields = [...prev];
            newFields.splice(overIndex, 0, newField);
            return newFields;
          });
        } else {
          setFields((prev) => [...prev, newField]);
        }
      }
      setSelectedFieldId(newField.id);
      return;
    }

    // Reordering existing fields
    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((f) => f.id === active.id);
        const newIndex = items.findIndex((f) => f.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  };

  const handleUpdateField = (updates: Partial<FormField>) => {
    if (!selectedFieldId) return;
    setFields((prev) =>
      prev.map((f) => (f.id === selectedFieldId ? { ...f, ...updates } : f))
    );
  };

  const handleDeleteField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  const handleSave = () => {
    if (!formTitle.trim()) {
      toast.error('Please add a form title');
      return;
    }
    if (fields.length === 0) {
      toast.error('Please add at least one field');
      return;
    }
    toast.success('Form saved successfully!');
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/form/preview`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Share link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden liftup-shadow">
                  <img src={clipboardIcon} alt="LiftupForms" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-lg font-bold liftup-gradient-text">LiftupForms</h1>
                  <p className="text-xs text-muted-foreground">Form Builder</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="hidden sm:flex"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Show Preview
                    </>
                  )}
                </Button>

                <Button variant="outline" size="sm" onClick={handleShare}>
                  {copied ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Share2 className="w-4 h-4 mr-2" />
                  )}
                  Share
                </Button>

                <Button size="sm" onClick={handleSave} className="liftup-gradient text-primary-foreground border-0">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6 h-[calc(100vh-8rem)]">
            {/* Left Panel - Field Palette */}
            <div className="w-64 shrink-0 hidden lg:block">
              <FieldPalette />
            </div>

            {/* Center - Form Canvas */}
            <div className="flex-1 min-w-0 flex flex-col">
              <FormCanvas
                fields={fields}
                selectedFieldId={selectedFieldId}
                onSelectField={setSelectedFieldId}
                onDeleteField={handleDeleteField}
                formTitle={formTitle}
                formDescription={formDescription}
                onTitleChange={setFormTitle}
                onDescriptionChange={setFormDescription}
              />
            </div>

            {/* Right Panel - Field Editor or Preview */}
            <div className="w-80 shrink-0 hidden md:flex flex-col gap-6">
              <FieldEditor
                field={selectedField}
                onUpdateField={handleUpdateField}
                onClose={() => setSelectedFieldId(null)}
              />
              
              {showPreview && (
                <div className="flex-1 min-h-0">
                  <FormPreview
                    title={formTitle}
                    description={formDescription}
                    fields={fields}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <DragOverlay>
        {activeId && activeId.startsWith('palette-') && (
          <div className="field-palette-item drag-overlay bg-card liftup-shadow-lg">
            <span className="text-sm font-medium">
              {FIELD_TYPES.find((f) => f.type === activeId.replace('palette-', ''))?.label}
            </span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
