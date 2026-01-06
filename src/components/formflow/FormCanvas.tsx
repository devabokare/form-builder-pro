import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormField } from '@/types/form';
import { SortableField } from './SortableField';
import { FileText, Plus } from 'lucide-react';

interface FormCanvasProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
  onDeleteField: (id: string) => void;
  formTitle: string;
  formDescription: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
}

export function FormCanvas({
  fields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  formTitle,
  formDescription,
  onTitleChange,
  onDescriptionChange,
}: FormCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'form-canvas',
  });

  return (
    <div className="form-builder-panel flex-1 flex flex-col min-h-0">
      {/* Form Header */}
      <div className="p-6 border-b border-border liftup-gradient rounded-t-2xl">
        <input
          type="text"
          value={formTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled Form"
          className="w-full text-2xl font-bold bg-transparent text-primary-foreground placeholder:text-primary-foreground/60 outline-none"
        />
        <input
          type="text"
          value={formDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Form description (optional)"
          className="w-full mt-2 text-sm bg-transparent text-primary-foreground/80 placeholder:text-primary-foreground/50 outline-none"
        />
      </div>

      {/* Canvas Drop Zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-6 overflow-y-auto transition-colors duration-200 ${
          isOver ? 'bg-accent/50' : ''
        }`}
      >
        {fields.length === 0 ? (
          <div className={`flex flex-col items-center justify-center h-full min-h-[300px] border-2 border-dashed rounded-xl transition-colors duration-200 ${
            isOver ? 'border-primary bg-accent' : 'border-border'
          }`}>
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">
              Drag fields here to build your form
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              or click a field type to add it
            </p>
          </div>
        ) : (
          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  isSelected={selectedFieldId === field.id}
                  onSelect={() => onSelectField(field.id)}
                  onDelete={() => onDeleteField(field.id)}
                />
              ))}
            </div>
          </SortableContext>
        )}

        {fields.length > 0 && (
          <div className={`mt-4 p-4 border-2 border-dashed rounded-xl text-center transition-colors duration-200 ${
            isOver ? 'border-primary bg-accent' : 'border-border'
          }`}>
            <Plus className="w-5 h-5 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground mt-1">Drop field here</p>
          </div>
        )}
      </div>
    </div>
  );
}
