import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

// Import modular components
import StoryFormHeader from './StoryFormHeader';
import StoryFormFields from './StoryFormFields';
import ImageUpload from './ImageUpload';
import StoryFormActions from './StoryFormActions';
import { useStoryFormValidation } from './StoryFormValidation';

const StoryForm = ({ 
  storyForm, 
  setStoryForm, 
  editingStory, 
  setEditingStory, 
  onStoryAdded, 
  onStoryUpdated 
}) => {
  const { toast } = useToast();
  const { validateForm } = useStoryFormValidation();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!validateForm(storyForm)) return;

    setSubmitting(true);
    try {
      const storyData = {
        title: storyForm.title.trim(),
        description: storyForm.description.trim(),
        level: storyForm.level,
        category: storyForm.category || 'adventure',
        content: storyForm.content.trim(),
        read_time: storyForm.read_time.trim(),
        image_url: storyForm.image_url || null
      };

      if (editingStory) {
        // Update existing story
        const { data, error } = await supabase
          .from('stories')
          .update({
            ...storyData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingStory.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating story:', error);
          toast({
            title: "Hata",
            description: `Hikaye güncellenirken bir hata oluştu: ${error.message}`,
            variant: "destructive"
          });
          return;
        }

        onStoryUpdated(data);
        toast({
          title: "Başarılı",
          description: "Hikaye başarıyla güncellendi.",
        });
      } else {
        // Add new story
        const { data, error } = await supabase
          .from('stories')
          .insert([{
            ...storyData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) {
          console.error('Error adding story:', error);
          toast({
            title: "Hata",
            description: `Hikaye eklenirken bir hata oluştu: ${error.message}`,
            variant: "destructive"
          });
          return;
        }

        onStoryAdded(data);
        toast({
          title: "Başarılı",
          description: "Hikaye başarıyla eklendi.",
        });
      }

      // Reset form
      handleCancel();

    } catch (error) {
      console.error('Error submitting story:', error);
      toast({
        title: "Hata",
        description: "Beklenmeyen bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingStory(null);
    setStoryForm({
      title: '',
      description: '',
      level: 'a1',
      category: 'adventure',
      content: '',
      read_time: '5 dk',
      image_url: ''
    });
  };

  return (
    <Card>
      <StoryFormHeader editingStory={editingStory} />
      <CardContent className="space-y-4">
        <StoryFormFields storyForm={storyForm} setStoryForm={setStoryForm} />
        <ImageUpload storyForm={storyForm} setStoryForm={setStoryForm} />
        <StoryFormActions
          editingStory={editingStory}
          submitting={submitting}
          uploading={false}
          storyForm={storyForm}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </CardContent>
    </Card>
  );
};

export default StoryForm;