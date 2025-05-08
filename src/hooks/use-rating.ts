
import { useState } from 'react';
import { TaskType } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export const useRating = (tasks: TaskType[], appliedTasks: TaskType[], handleSubmitRating: (taskId: string, rating: number) => Promise<boolean>) => {
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [isEnforcedRating, setIsEnforcedRating] = useState(false);
  const [currentTaskForRating, setCurrentTaskForRating] = useState<TaskType | null>(null);
  const { user } = useAuth();

  const checkForTasksNeedingRating = () => {
    console.log("Checking for tasks needing rating");
    console.log("Applied tasks:", appliedTasks);
    
    // First check if the user is a doer who needs to rate a task
    const doerTask = appliedTasks.find(task => 
      task.doerId === user?.id && 
      task.isRequestorVerified && 
      task.isDoerVerified && 
      !task.isDoerRated
    );
    
    console.log("Found doer task needing rating:", doerTask);
    
    if (doerTask) {
      setCurrentTaskForRating(doerTask);
      setIsRatingDialogOpen(true);
      setIsEnforcedRating(true);
      return true;
    }
    
    // Then check if the user is a creator who needs to rate a task
    const requestorTask = tasks.find(task => 
      task.isRequestorVerified && 
      task.isDoerVerified && 
      !task.isRequestorRated
    );
    
    if (requestorTask) {
      setCurrentTaskForRating(requestorTask);
      setIsRatingDialogOpen(true);
      setIsEnforcedRating(true);
      return true;
    }
    
    return false;
  };

  const handleRequestRating = () => {
    checkForTasksNeedingRating();
  };

  const onSubmitRating = async (rating: number) => {
    if (!currentTaskForRating) {
      console.error("No current task for rating");
      return false;
    }
    
    const taskId = currentTaskForRating.id;
    console.log(`Submitting rating ${rating} for task ${taskId}`);
    
    try {
      // Clear state immediately to prevent re-renders from showing the dialog again
      setIsRatingDialogOpen(false);
      const taskToRate = currentTaskForRating;
      setCurrentTaskForRating(null);
      setIsEnforcedRating(false);
      
      // Call handleSubmitRating from task-actions.ts
      console.log("Calling handleSubmitRating with taskId:", taskId, "and rating:", rating);
      const result = await handleSubmitRating(taskId, rating);
      
      console.log("Rating submission result:", result);
      return result;
    } catch (error) {
      console.error("Error in onSubmitRating:", error);
      return false;
    }
  };

  return {
    isRatingDialogOpen,
    setIsRatingDialogOpen,
    isEnforcedRating,
    currentTaskForRating,
    checkForTasksNeedingRating,
    handleRequestRating,
    onSubmitRating
  };
};
