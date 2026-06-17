import React from "react";
import { useState, useCallback} from "react";

import { Step, ProjectDraft,  } from "./creationTypes";
import { generateProjectPlan } from "../api/projects";

export function useProjectCreation(
  onClose: () => void,
  onCreated?: (draft: ProjectDraft) => void
) {
  
    //step is the current step we're on
      const [step, setStep] = useState<Step>("outcome");
      //holding the draft state so we can pass it to the various steps
      const [draft, setDraft] = useState<ProjectDraft>({
        goal: "",
        description: "",
        targetDate: "",
        clarifications: { c1: "", c2: "", c3: "" },
        phases: [],
      });
      const [error, setError] = useState<string | null>(null);
    
    
      //this funcions helps is navigate betwee nthe different screens (outcome, clarify, generating, review)
      const goTo = (s: Step) => {
        //clearing any previous errors and updating the step state which makes react re-render and show the new screen
        setError(null);
        setStep(s);
      };
    
      //called when user submits the first step("outcome")
      const handleOutcomeNext = (
        data: Pick<ProjectDraft, "goal" | "description" | "targetDate">
      ) => {
        //merge the input data (goal, description, target date) into the current draft using setDraft
        setDraft((d) => ({ ...d, ...data }));
        goTo("clarify");
      };
    
      //when the user completes or skips the clarify step
      const handleClarifyNext = (
        clarifications: ProjectDraft["clarifications"],
        skip: boolean
      ) => {
        //sets draft with new clarification answers
        const updated = { ...draft, clarifications: skip ? draft.clarifications : clarifications };
        setDraft(updated);
        //calls goTo for next step
        goTo("generating");
        //triggers runGeneration to start plan creation in the background
        runGeneration(updated);
      };
    
      const runGeneration = useCallback(async (d: ProjectDraft) => {
        try {
          const phases = await generateProjectPlan(d);
          setDraft((prev) => ({ ...prev, phases }));
          goTo("review");
        } catch (e) {
          setError("Generation failed. Please try again.");
          goTo("clarify");
        }
      }, []);
    
      const handleCreate = () => {
        onCreated?.(draft);
        onClose();
      };
    

  return {
    step,
    draft,
    error,
    goTo,
    handleOutcomeNext,
    handleClarifyNext,
    handleCreate,
  };
}